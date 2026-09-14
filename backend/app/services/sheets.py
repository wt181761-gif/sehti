"""
Send completed order data to Google Sheets via webhook.
Failures are logged but never break the order flow.
"""
import logging
import httpx
from datetime import datetime, timezone

from app.core.config import get_settings
from app.schemas.orders import CompleteOrderOut

logger = logging.getLogger("sehti.sheets")


def _build_payload(order: CompleteOrderOut) -> dict:
    items_str = " | ".join(
        f"{it.product_name_ar} × {it.offer_qty} ({it.price_mad} MAD)"
        for it in order.items
    )
    return {
        "order_id": order.order_id,
        "order_number": order.order_number,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "customer_name": order.customer_name,
        "phone": order.phone,
        "items": items_str,
        "subtotal_mad": order.subtotal_mad,
        "upsell_total_mad": order.upsell_total_mad,
        "total_mad": order.total_mad,
        "currency": order.currency,
        "status": "new",
        "upsell_added": order.upsell_total_mad > 0,
    }


async def send_to_sheets(order: CompleteOrderOut) -> bool:
    settings = get_settings()
    webhook_url = settings.GOOGLE_SHEETS_WEBHOOK_URL
    if not webhook_url:
        logger.warning("GOOGLE_SHEETS_WEBHOOK_URL not configured — skipping sheet sync")
        return False

    payload = _build_payload(order)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(webhook_url, json=payload)
            resp.raise_for_status()
            logger.info("Sheet sync OK for order %s", order.order_number)
            return True
    except Exception as exc:
        logger.error("Sheet sync FAILED for order %s: %s", order.order_number, exc)
        return False
