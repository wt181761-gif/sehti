"""
Single source of truth for all pricing.
Backend always recalculates — never trust frontend prices.
"""

PRODUCTS: dict[str, str] = {
    "miswak-powder": "مسحوق المسواك الطبيعي ضد حساسية الأسنان",
    "digestive-herbs": "خليط الأعشاب الهاضمة ضد الانتفاخ",
    "turmeric-boswellia": "مزيج الكركم واللبان ضد آلام المفاصل",
}

OFFER_PRICES: dict[int, int] = {
    1: 199,
    2: 279,
    3: 349,
}

POST_FORM_UPSELL_PRICE: int = 99

# Priority order for upsell suggestion
UPSELL_PRIORITY = ["digestive-herbs", "miswak-powder", "turmeric-boswellia"]


def calculate_item_price(offer_qty: int) -> int:
    """Return MAD price for a given offer quantity."""
    return OFFER_PRICES[offer_qty]


def calculate_subtotal(items: list[dict]) -> int:
    """
    items: list of {"product_id": str, "offer_qty": int}
    Returns total MAD, recalculated server-side.
    """
    total = 0
    for item in items:
        qty = item["offer_qty"]
        total += OFFER_PRICES[qty]
    return total


def pick_upsell(cart_product_ids: list[str]) -> str | None:
    """Return the best upsell product_id not already in cart, or None."""
    for pid in UPSELL_PRIORITY:
        if pid not in cart_product_ids:
            return pid
    return None


def get_product_name_ar(product_id: str) -> str:
    return PRODUCTS.get(product_id, product_id)
