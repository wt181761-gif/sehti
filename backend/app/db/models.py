import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    String, Integer, Text, DateTime, ForeignKey, BigInteger, JSON
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False)
    customer_name: Mapped[str] = mapped_column(Text, nullable=False)
    phone_local: Mapped[str] = mapped_column(Text, nullable=False)
    phone_e164: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="new")
    subtotal_mad: Mapped[int] = mapped_column(Integer, nullable=False)
    upsell_total_mad: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_mad: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="MAD")
    event_id: Mapped[str] = mapped_column(Text, nullable=False)
    page_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    client_ip: Mapped[str | None] = mapped_column(Text, nullable=True)
    fbp: Mapped[str | None] = mapped_column(Text, nullable=True)
    fbc: Mapped[str | None] = mapped_column(Text, nullable=True)
    ttp: Mapped[str | None] = mapped_column(Text, nullable=True)
    ttclid: Mapped[str | None] = mapped_column(Text, nullable=True)
    sheet_synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    meta_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    tiktok_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)

    items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id: Mapped[str] = mapped_column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[str] = mapped_column(Text, nullable=False)
    product_name_ar: Mapped[str] = mapped_column(Text, nullable=False)
    item_type: Mapped[str] = mapped_column(String(50), nullable=False, default="normal")
    offer_qty: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    price_mad: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utcnow)

    order: Mapped["Order"] = relationship("Order", back_populates="items")


class OrderDraft(Base):
    __tablename__ = "order_drafts"

    token: Mapped[str] = mapped_column(Text, primary_key=True)
    customer_name: Mapped[str] = mapped_column(Text, nullable=False)
    phone_local: Mapped[str] = mapped_column(Text, nullable=False)
    phone_e164: Mapped[str] = mapped_column(Text, nullable=False)
    items_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    subtotal_mad: Mapped[int] = mapped_column(Integer, nullable=False)
    event_id: Mapped[str] = mapped_column(Text, nullable=False)
    tracking_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utcnow)


class OrderCounter(Base):
    """Single-row table for atomic order number generation."""
    __tablename__ = "order_counter"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    last_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1000)
