"""
Order creation service: draft → complete.
"""
import secrets
import uuid
from datetime import datetime, timezone, timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Order, OrderItem, OrderDraft, OrderCounter
from app.services.pricing import (
    calculate_subtotal,
    pick_upsell,
    get_product_name_ar,
    POST_FORM_UPSELL_PRICE,
    OFFER_PRICES,
)
from app.services.phone import normalize_ma_phone
from app.schemas.orders import PrepareOrderIn, PrepareOrderOut, CompleteOrderOut, OrderItemOut


DRAFT_TTL_SECONDS = 900  # 15 minutes


async def _next_order_number(db: AsyncSession) -> int:
    """Atomically increment and return the next order number."""
    result = await db.execute(select(OrderCounter).with_for_update())
    counter = result.scalar_one_or_none()
    if counter is None:
        counter = OrderCounter(id=1, last_number=1000)
        db.add(counter)
        await db.flush()
        return 1001
    counter.last_number += 1
    await db.flush()
    return counter.last_number


async def prepare_order(db: AsyncSession, data: PrepareOrderIn) -> PrepareOrderOut:
    phone_local, phone_e164 = normalize_ma_phone(data.phone)

    items_raw = [{"product_id": i.product_id, "offer_qty": i.offer_qty} for i in data.items]
    subtotal = calculate_subtotal(items_raw)
    cart_ids = [i.product_id for i in data.items]
    upsell_id = pick_upsell(cart_ids)

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=DRAFT_TTL_SECONDS)

    draft = OrderDraft(
        token=token,
        customer_name=data.customer_name,
        phone_local=phone_local,
        phone_e164=phone_e164,
        items_json=items_raw,
        subtotal_mad=subtotal,
        event_id=data.event_id,
        tracking_json={
            "fbp": data.fbp,
            "fbc": data.fbc,
            "ttp": data.ttp,
            "ttclid": data.ttclid,
            "page_url": data.page_url,
            "user_agent": data.user_agent,
        },
        expires_at=expires_at,
    )
    db.add(draft)
    await db.commit()

    return PrepareOrderOut(
        order_token=token,
        subtotal_mad=subtotal,
        upsell_product_id=upsell_id,
        upsell_price_mad=POST_FORM_UPSELL_PRICE,
        expires_in_seconds=12,
    )


async def complete_order(
    db: AsyncSession,
    order_token: str,
    accepted_upsell: bool,
    client_ip: str | None = None,
) -> CompleteOrderOut:
    now = datetime.now(timezone.utc)

    # Load and validate draft
    result = await db.execute(
        select(OrderDraft).where(OrderDraft.token == order_token)
    )
    draft = result.scalar_one_or_none()
    if draft is None:
        raise ValueError("Invalid or expired order token")
    if draft.expires_at < now:
        raise ValueError("Order token expired")

    # Recalculate pricing
    items_raw: list[dict] = draft.items_json
    subtotal = calculate_subtotal(items_raw)

    upsell_total = 0
    upsell_id: str | None = None
    if accepted_upsell:
        cart_ids = [i["product_id"] for i in items_raw]
        upsell_id = pick_upsell(cart_ids)
        if upsell_id:
            upsell_total = POST_FORM_UPSELL_PRICE

    total = subtotal + upsell_total

    tracking: dict = draft.tracking_json or {}
    order_number = await _next_order_number(db)

    order = Order(
        id=str(uuid.uuid4()),
        order_number=order_number,
        customer_name=draft.customer_name,
        phone_local=draft.phone_local,
        phone_e164=draft.phone_e164,
        status="new",
        subtotal_mad=subtotal,
        upsell_total_mad=upsell_total,
        total_mad=total,
        currency="MAD",
        event_id=draft.event_id,
        page_url=tracking.get("page_url"),
        user_agent=tracking.get("user_agent"),
        client_ip=client_ip,
        fbp=tracking.get("fbp"),
        fbc=tracking.get("fbc"),
        ttp=tracking.get("ttp"),
        ttclid=tracking.get("ttclid"),
    )
    db.add(order)

    order_items_out: list[OrderItemOut] = []

    for raw_item in items_raw:
        pid = raw_item["product_id"]
        qty = raw_item["offer_qty"]
        price = OFFER_PRICES[qty]
        item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order.id,
            product_id=pid,
            product_name_ar=get_product_name_ar(pid),
            item_type="normal",
            offer_qty=qty,
            price_mad=price,
        )
        db.add(item)
        order_items_out.append(
            OrderItemOut(
                product_id=pid,
                product_name_ar=item.product_name_ar,
                item_type="normal",
                offer_qty=qty,
                price_mad=price,
            )
        )

    if accepted_upsell and upsell_id:
        upsell_item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order.id,
            product_id=upsell_id,
            product_name_ar=get_product_name_ar(upsell_id),
            item_type="post_form_upsell",
            offer_qty=1,
            price_mad=POST_FORM_UPSELL_PRICE,
        )
        db.add(upsell_item)
        order_items_out.append(
            OrderItemOut(
                product_id=upsell_id,
                product_name_ar=upsell_item.product_name_ar,
                item_type="post_form_upsell",
                offer_qty=1,
                price_mad=POST_FORM_UPSELL_PRICE,
            )
        )

    # Delete used draft
    await db.delete(draft)
    await db.commit()
    await db.refresh(order)

    return CompleteOrderOut(
        order_id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        phone=order.phone_local,
        items=order_items_out,
        subtotal_mad=subtotal,
        upsell_total_mad=upsell_total,
        total_mad=total,
        currency="MAD",
    )
