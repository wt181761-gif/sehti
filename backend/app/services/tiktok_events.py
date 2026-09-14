"""
TikTok Events API — Purchase / CompletePayment event.
Failures are logged but never break the order flow.
"""
import time
import logging
import httpx

from app.core.config import get_settings
from app.schemas.orders import CompleteOrderOut
from app.services.phone import phone_hash_for_pixels

logger = logging.getLogger("sehti.tiktok_events")

TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/pixel/track/"


def _build_payload(order: CompleteOrderOut, tracking: dict, settings) -> dict:
    contents = [
        {"content_id": it.product_id, "quantity": it.offer_qty, "price": it.price_mad}
        for it in order.items
    ]

    context: dict = {
        "ip": tracking.get("client_ip"),
        "user_agent": tracking.get("user_agent"),
        "page": {"url": tracking.get("page_url")},
    }

    user: dict = {}
    phone_e164 = tracking.get("phone_e164")
    if phone_e164:
        user["phone_number"] = phone_hash_for_pixels(phone_e164)
    ttp = tracking.get("ttp")
    if ttp:
        user["ttp"] = ttp

    if user:
        context["user"] = user

    ad: dict = {}
    ttclid = tracking.get("ttclid")
    if ttclid:
        ad["callback"] = ttclid
    if ad:
        context["ad"] = ad

    # Remove None values deeply
    context = {k: v for k, v in context.items() if v is not None}

    event = {
        "event": "CompletePayment",
        "event_id": tracking.get("event_id", order.order_id),
        "timestamp": str(int(time.time())),
        "context": context,
        "properties": {
            "value": order.total_mad,
            "currency": "MAD",
            "contents": contents,
            "order_id": order.order_id,
        },
    }
    if settings.TIKTOK_TEST_EVENT_CODE:
        event["test_event_code"] = settings.TIKTOK_TEST_EVENT_CODE

    return {
        "pixel_code": settings.TIKTOK_PIXEL_CODE,
        "event": "CompletePayment",
        "event_id": tracking.get("event_id", order.order_id),
        "timestamp": str(int(time.time())),
        "context": context,
        "properties": {
            "value": order.total_mad,
            "currency": "MAD",
            "contents": contents,
            "order_id": order.order_id,
        },
    }


async def send_purchase_event(order: CompleteOrderOut, tracking: dict) -> bool:
    settings = get_settings()
    if not settings.TIKTOK_PIXEL_CODE or not settings.TIKTOK_ACCESS_TOKEN:
        logger.warning("TikTok Events API not configured — skipping")
        return False

    payload = _build_payload(order, tracking, settings)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                TIKTOK_EVENTS_URL,
                json=payload,
                headers={
                    "Access-Token": settings.TIKTOK_ACCESS_TOKEN,
                    "Content-Type": "application/json",
                },
            )
            resp.raise_for_status()
            logger.info("TikTok Events Purchase sent for order %s", order.order_number)
            return True
    except Exception as exc:
        logger.error("TikTok Events FAILED for order %s: %s", order.order_number, exc)
        return False
