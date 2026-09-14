# Backend Architecture: FastAPI, PostgreSQL, Orders

## Stack

Use:

- Python 3.12+
- FastAPI
- Uvicorn / Gunicorn Uvicorn worker if needed
- SQLAlchemy 2.0 async
- Alembic migrations
- asyncpg PostgreSQL driver
- Pydantic v2
- pydantic-settings
- httpx for outbound webhooks and pixel APIs
- python-dotenv for local dev

## Folder Structure

```text
backend/
  app/
    main.py
    core/
      config.py
      security.py
      logging.py
    db/
      session.py
      base.py
      models.py
      migrations/
    schemas/
      orders.py
      tracking.py
    services/
      pricing.py
      phone.py
      orders.py
      sheets.py
      meta_capi.py
      tiktok_events.py
      tracking.py
    api/
      routes/
        health.py
        orders.py
  alembic.ini
  Dockerfile
  docker-compose.yml
  requirements.txt
  .env.example
```

## Environment

Create `backend/.env.example`:

```env
APP_ENV=production
APP_NAME=sehti-api
FRONTEND_URL=https://sehti.online
BACKEND_URL=https://api.sehti.online

# Do not commit the real password.
DATABASE_URL=postgresql+asyncpg://sehti:CHANGE_ME@sehti_database:5432/sehti

GOOGLE_SHEETS_WEBHOOK_URL=

META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=

TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=

CORS_ORIGINS=https://sehti.online
```

Use the internal EasyPanel database hostname. The user has the real connection string. Do not write the real password into committed files.

## Database Migration On Startup

Use Alembic.

On backend startup:

1. Run pending migrations.
2. Start FastAPI app.

Recommended entrypoint script:

```sh
#!/bin/sh
set -e
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
```

FastAPI docs confirm lifespan/startup events can initialize resources, but for production DB changes use migrations before launch.

## Database Tables

### orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number BIGSERIAL UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone_local TEXT NOT NULL,
  phone_e164 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  subtotal_mad INTEGER NOT NULL,
  upsell_total_mad INTEGER NOT NULL DEFAULT 0,
  total_mad INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MAD',
  event_id TEXT NOT NULL,
  page_url TEXT,
  user_agent TEXT,
  client_ip TEXT,
  fbp TEXT,
  fbc TEXT,
  ttp TEXT,
  ttclid TEXT,
  sheet_synced_at TIMESTAMPTZ,
  meta_sent_at TIMESTAMPTZ,
  tiktok_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### order_items

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name_ar TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'normal',
  offer_qty INTEGER NOT NULL DEFAULT 1,
  price_mad INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

`item_type` values:

- `normal`
- `post_form_upsell`

### order_drafts

Use this table for the checkout flow before the upsell decision:

```sql
CREATE TABLE order_drafts (
  token TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone_local TEXT NOT NULL,
  phone_e164 TEXT NOT NULL,
  items_json JSONB NOT NULL,
  subtotal_mad INTEGER NOT NULL,
  event_id TEXT NOT NULL,
  tracking_json JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Product And Offer Config

Keep pricing in backend too, not only frontend.

```python
PRODUCTS = {
    "miswak-powder": "مسحوق المسواك الطبيعي ضد حساسية الأسنان",
    "digestive-herbs": "خليط الأعشاب الهاضمة ضد الانتفاخ",
    "turmeric-boswellia": "مزيج الكركم واللبان ضد آلام المفاصل",
}

OFFER_PRICES = {
    1: 199,
    2: 279,
    3: 349,
}

POST_FORM_UPSELL_PRICE = 99
```

Backend must recalculate all prices. Never trust frontend prices.

## Phone Validation

Frontend accepts local Moroccan numbers only:

```text
0XXXXXXXXX
```

Backend validates and normalizes:

- Remove spaces, hyphens, parentheses.
- Must match `^0[5-7][0-9]{8}$`.
- Convert to E.164:
  - `0612345678` -> `+212612345678`

For hashed identifiers:

- Meta `ph`: hash normalized digits without `+`: `212612345678`.
- TikTok `phone_number`: hash normalized E.164 or normalized digits consistently. Recommended: digits only `212612345678`.

## API Endpoints

### Health

```http
GET /health
```

Returns:

```json
{ "status": "ok" }
```

### Prepare Order

```http
POST /api/orders/prepare
```

Purpose: validate customer + cart, create short-lived draft, return relevant upsell.

Request:

```json
{
  "customer_name": "محمد العلوي",
  "phone": "0612345678",
  "items": [
    {
      "product_id": "miswak-powder",
      "offer_qty": 2
    }
  ],
  "event_id": "uuid",
  "fbp": "fb.1...",
  "fbc": "fb.1...",
  "ttp": "tiktok-cookie",
  "ttclid": "click-id",
  "page_url": "https://sehti.online/products/...",
  "user_agent": "browser user agent"
}
```

Response:

```json
{
  "order_token": "secure-random-token",
  "subtotal_mad": 279,
  "upsell_product_id": "digestive-herbs",
  "upsell_price_mad": 99,
  "expires_in_seconds": 12
}
```

### Complete Order

```http
POST /api/orders/complete
```

Purpose: create final order, optionally add upsell, send sheet webhook, send CAPI events.

Request:

```json
{
  "order_token": "secure-random-token",
  "accepted_upsell": true
}
```

Response:

```json
{
  "order_id": "uuid",
  "order_number": 1001,
  "customer_name": "محمد العلوي",
  "phone": "0612345678",
  "items": [
    {
      "product_id": "miswak-powder",
      "product_name_ar": "مسحوق المسواك الطبيعي ضد حساسية الأسنان",
      "item_type": "normal",
      "offer_qty": 2,
      "price_mad": 279
    },
    {
      "product_id": "digestive-herbs",
      "product_name_ar": "خليط الأعشاب الهاضمة ضد الانتفاخ",
      "item_type": "post_form_upsell",
      "offer_qty": 1,
      "price_mad": 99
    }
  ],
  "total_mad": 378,
  "currency": "MAD"
}
```

## Order Statuses

Use:

- `new`
- `called_no_answer`
- `confirmed`
- `cancelled`
- `shipped`
- `delivered`
- `returned`

MVP only needs to create `new`.

## CORS

Allow only:

```text
https://sehti.online
http://localhost:3000
```

Use env-driven origins.

## Security Notes

- Never expose pixel access tokens in frontend.
- Hash identifiers server-side.
- Store raw phone only for order fulfillment; do not send raw phone to pixel APIs.
- Validate request bodies with Pydantic.
- Recalculate pricing server-side.
- Rate-limit order endpoints if abuse starts.
- Keep logs useful but avoid logging access tokens.
