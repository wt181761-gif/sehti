"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-09-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "order_counter",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("last_number", sa.Integer(), nullable=False, server_default="1000"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.execute("INSERT INTO order_counter (id, last_number) VALUES (1, 1000) ON CONFLICT DO NOTHING")

    op.create_table(
        "orders",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("order_number", sa.BigInteger(), nullable=False),
        sa.Column("customer_name", sa.Text(), nullable=False),
        sa.Column("phone_local", sa.Text(), nullable=False),
        sa.Column("phone_e164", sa.Text(), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="new"),
        sa.Column("subtotal_mad", sa.Integer(), nullable=False),
        sa.Column("upsell_total_mad", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("total_mad", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="MAD"),
        sa.Column("event_id", sa.Text(), nullable=False),
        sa.Column("page_url", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("client_ip", sa.Text(), nullable=True),
        sa.Column("fbp", sa.Text(), nullable=True),
        sa.Column("fbc", sa.Text(), nullable=True),
        sa.Column("ttp", sa.Text(), nullable=True),
        sa.Column("ttclid", sa.Text(), nullable=True),
        sa.Column("sheet_synced_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("meta_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("tiktok_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("order_number"),
    )

    op.create_table(
        "order_items",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("order_id", sa.String(36), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", sa.Text(), nullable=False),
        sa.Column("product_name_ar", sa.Text(), nullable=False),
        sa.Column("item_type", sa.String(50), nullable=False, server_default="normal"),
        sa.Column("offer_qty", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("price_mad", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "order_drafts",
        sa.Column("token", sa.Text(), nullable=False),
        sa.Column("customer_name", sa.Text(), nullable=False),
        sa.Column("phone_local", sa.Text(), nullable=False),
        sa.Column("phone_e164", sa.Text(), nullable=False),
        sa.Column("items_json", sa.JSON(), nullable=False),
        sa.Column("subtotal_mad", sa.Integer(), nullable=False),
        sa.Column("event_id", sa.Text(), nullable=False),
        sa.Column("tracking_json", sa.JSON(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("token"),
    )

    # Indexes
    op.create_index("ix_orders_order_number", "orders", ["order_number"])
    op.create_index("ix_orders_created_at", "orders", ["created_at"])
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])
    op.create_index("ix_order_drafts_expires_at", "order_drafts", ["expires_at"])


def downgrade() -> None:
    op.drop_table("order_drafts")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("order_counter")
