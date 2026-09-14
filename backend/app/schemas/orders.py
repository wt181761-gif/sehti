from pydantic import BaseModel, field_validator
import re


class CartItemIn(BaseModel):
    product_id: str
    offer_qty: int

    @field_validator("offer_qty")
    @classmethod
    def validate_qty(cls, v: int) -> int:
        if v not in (1, 2, 3):
            raise ValueError("offer_qty must be 1, 2, or 3")
        return v

    @field_validator("product_id")
    @classmethod
    def validate_product_id(cls, v: str) -> str:
        allowed = {"miswak-powder", "digestive-herbs", "turmeric-boswellia"}
        if v not in allowed:
            raise ValueError(f"Unknown product_id: {v}")
        return v


class PrepareOrderIn(BaseModel):
    customer_name: str
    phone: str
    items: list[CartItemIn]
    event_id: str
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    ttclid: str | None = None
    page_url: str | None = None
    user_agent: str | None = None

    @field_validator("customer_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("customer_name is too short")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-\(\)]", "", v)
        if not re.match(r"^0[5-7][0-9]{8}$", cleaned):
            raise ValueError("Invalid Moroccan phone number")
        return cleaned

    @field_validator("items")
    @classmethod
    def validate_items(cls, v: list[CartItemIn]) -> list[CartItemIn]:
        if not v:
            raise ValueError("items must not be empty")
        return v


class PrepareOrderOut(BaseModel):
    order_token: str
    subtotal_mad: int
    upsell_product_id: str | None
    upsell_price_mad: int
    expires_in_seconds: int


class CompleteOrderIn(BaseModel):
    order_token: str
    accepted_upsell: bool = False


class OrderItemOut(BaseModel):
    product_id: str
    product_name_ar: str
    item_type: str
    offer_qty: int
    price_mad: int


class CompleteOrderOut(BaseModel):
    order_id: str
    order_number: int
    customer_name: str
    phone: str
    items: list[OrderItemOut]
    subtotal_mad: int
    upsell_total_mad: int
    total_mad: int
    currency: str
