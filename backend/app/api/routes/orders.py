import asyncio
import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.orders import (
    PrepareOrderIn,
    PrepareOrderOut,
    CompleteOrderIn,
    CompleteOrderOut,
)
from app.services import orders as order_service
from app.services import sheets, meta_capi, tiktok_events
from app.db.models import Order
from sqlalchemy import select, update
from datetime import datetime, timezone

logger = logging.getLogger("sehti.orders")

router = APIRouter(prefix="/api/orders")


def get_client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post("/prepare", response_model=PrepareOrderOut)
async def prepare_order(
    body: PrepareOrderIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await order_service.prepare_order(db, body)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        logger.error("prepare_order error: %s", exc)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/complete", response_model=CompleteOrderOut)
async def complete_order(
    body: CompleteOrderIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    client_ip = get_client_ip(request)
    try:
        order = await order_service.complete_order(
            db=db,
            order_token=body.order_token,
            accepted_upsell=body.accepted_upsell,
            client_ip=client_ip,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        logger.error("complete_order error: %s", exc)
        raise HTTPException(status_code=500, detail="Internal server error")

    # Build tracking dict for outbound calls
    db_result = await db.execute(
        select(Order).where(Order.id == order.order_id)
    )
    db_order = db_result.scalar_one_or_none()
    tracking: dict = {}
    if db_order:
        tracking = {
            "event_id": db_order.event_id,
            "phone_e164": db_order.phone_e164,
            "client_ip": db_order.client_ip,
            "user_agent": db_order.user_agent,
            "page_url": db_order.page_url,
            "fbp": db_order.fbp,
            "fbc": db_order.fbc,
            "ttp": db_order.ttp,
            "ttclid": db_order.ttclid,
        }

    # Fire outbound integrations concurrently — failures must NOT break order
    async def _send_sheet():
        success = await sheets.send_to_sheets(order)
        if success and db_order:
            await db.execute(
                update(Order)
                .where(Order.id == db_order.id)
                .values(sheet_synced_at=datetime.now(timezone.utc))
            )
            await db.commit()

    async def _send_meta():
        success = await meta_capi.send_purchase_event(order, tracking)
        if success and db_order:
            await db.execute(
                update(Order)
                .where(Order.id == db_order.id)
                .values(meta_sent_at=datetime.now(timezone.utc))
            )
            await db.commit()

    async def _send_tiktok():
        success = await tiktok_events.send_purchase_event(order, tracking)
        if success and db_order:
            await db.execute(
                update(Order)
                .where(Order.id == db_order.id)
                .values(tiktok_sent_at=datetime.now(timezone.utc))
            )
            await db.commit()

    # Fire and forget — do not await failures
    asyncio.create_task(_send_sheet())
    asyncio.create_task(_send_meta())
    asyncio.create_task(_send_tiktok())

    return order
