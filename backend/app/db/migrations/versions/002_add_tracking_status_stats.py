"""add tracking_events, order_status_history, daily_stats

Revision ID: 002
Revises: 001
Create Date: 2026-09-15 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- tracking_events ---
    op.create_table(
        "tracking_events",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("order_id", sa.String(36), sa.ForeignKey("orders.id", ondelete="SET NULL"), nullable=True),
        sa.Column("event_name", sa.String(50), nullable=False),
        sa.Column("event_id", sa.Text(), nullable=False),
        sa.Column("platform", sa.String(20), nullable=False),
        sa.Column("source", sa.String(20), nullable=False),
        sa.Column("payload_json", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="sent"),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("phone_hash", sa.Text(), nullable=True),
        sa.Column("ip_address", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_tracking_events_order_id", "tracking_events", ["order_id"])
    op.create_index("ix_tracking_events_event_name", "tracking_events", ["event_name"])
    op.create_index("ix_tracking_events_platform", "tracking_events", ["platform"])
    op.create_index("ix_tracking_events_event_id", "tracking_events", ["event_id"])
    op.create_index("ix_tracking_events_created_at", "tracking_events", ["created_at"])

    # --- order_status_history ---
    op.create_table(
        "order_status_history",
        sa.Column("id", sa.String(36), nullable=False),
        sa.Column("order_id", sa.String(36), sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("old_status", sa.String(50), nullable=True),
        sa.Column("new_status", sa.String(50), nullable=False),
        sa.Column("changed_by", sa.String(50), nullable=False, server_default="system"),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_order_status_history_order_id", "order_status_history", ["order_id"])
    op.create_index("ix_order_status_history_new_status", "order_status_history", ["new_status"])
    op.create_index("ix_order_status_history_created_at", "order_status_history", ["created_at"])

    # --- daily_stats ---
    op.create_table(
        "daily_stats",
        sa.Column("date_str", sa.String(10), nullable=False),
        sa.Column("total_orders", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("confirmed_orders", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("total_revenue_mad", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("total_upsell_mad", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("avg_order_value_mad", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("upsell_accept_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("unique_visitors", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("add_to_cart_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("checkout_started_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("date_str"),
    )

    # --- Add indexes on orders table for common lookups ---
    op.create_index("ix_orders_status", "orders", ["status"])
    op.create_index("ix_orders_phone_local", "orders", ["phone_local"])


def downgrade() -> None:
    op.drop_index("ix_orders_phone_local", table_name="orders")
    op.drop_index("ix_orders_status", table_name="orders")
    op.drop_table("daily_stats")
    op.drop_table("order_status_history")
    op.drop_table("tracking_events")
