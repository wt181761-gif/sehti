"""
Meta Conversions API (CAPI) — Purchase event.
Failures are logged but never break the order flow.
"""
import time
import logging
import httpx

from app.core.config import get_settings
from app.schemas.orders import CompleteOrderOut
from app.services.phone import phone_hash_for_pixels

logger = logging.getLogger("sehti.meta_capi")

META_CAPI_URL = "https://graph.facebook.com/v25.0/{pixel_id}/events"


def _build_payload(order: CompleteOrderOut, tracking: dict, settings) -> dict:
    contents = [
        {"id": it.product_id, "quantity": it.offer_qty, "item_price": it.price_mad}
        for it in order.items
    ]
    content_ids = [it.product_id for it in order.items]

    user_data: dict = {
        "client_ip_address": tracking.get("client_ip"),
        "client_user_agent": tracking.get("user_agent"),
        "fbp": tracking.get("fbp"),
        "fbc": tracking.get("fbc"),
    }
    phone_e164 = tracking.get("phone_e164")
    if phone_e164:
        user_data["ph"] = [phone_hash_for_pixels(phone_e164)]

    # Remove None values
    user_data = {k: v for k, v in user_data.items() if v is not None}

    event: dict = {
        "event_name": "Purchase",
        "event_time": int(time.time()),
        "event_id": tracking.get("event_id", order.order_id),
        "action_source": "website",
        "user_data": user_data,
        "custom_data": {
            "value": order.total_mad,
            "currency": "MAD",
            "content_ids": content_ids,
            "content_type": "product",
            "contents": contents,
            "order_id": order.order_id,
        },
    }

    page_url = tracking.get("page_url")
    if page_url:
        event["event_source_url"] = page_url

    payload: dict = {
        "data": [event],
        "access_token": settings.META_ACCESS_TOKEN,
    }
    if settings.META_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.META_TEST_EVENT_CODE

    return payload


async def send_purchase_event(order: CompleteOrderOut, tracking: dict) -> bool:
    settings = get_settings()
    if not settings.META_PIXEL_ID or not settings.META_ACCESS_TOKEN:
        logger.warning("Meta CAPI not configured — skipping")
        return False

    url = META_CAPI_URL.format(pixel_id=settings.META_PIXEL_ID)
    payload = _build_payload(order, tracking, settings)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            logger.info("Meta CAPI Purchase sent for order %s", order.order_number)
            return True
    except Exception as exc:
        logger.error("Meta CAPI FAILED for order %s: %s", order.order_number, exc)
        return False
