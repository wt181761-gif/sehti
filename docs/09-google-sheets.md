# Google Sheets Order Webhook

## Goal

Every completed COD order must be sent from the FastAPI backend to Google Sheets.

Frontend must not call the sheet webhook directly. Backend calls it after final order creation, so tracking, pricing, and upsell logic stay reliable.

## Sheet Tab

Create a Google Sheet with tab name:

```text
Orders
```

Use the CSV template:

```text
docs/templates/orders-sheet-template.csv
```

## Columns

Required columns:

```text
Order ID
Order Number
Created At
Customer Name
Phone Local
Phone E164
Products
Normal Items Total MAD
Upsell Product
Upsell Total MAD
Order Total MAD
Currency
Status
Source
Page URL
Event ID
Meta Sent
TikTok Sent
Notes
```

## Backend Payload To Sheet

Backend should POST JSON:

```json
{
  "order_id": "uuid",
  "order_number": 1001,
  "created_at": "2026-09-11T12:00:00Z",
  "customer_name": "محمد العلوي",
  "phone_local": "0612345678",
  "phone_e164": "+212612345678",
  "products": [
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
  "normal_items_total_mad": 279,
  "upsell_total_mad": 99,
  "order_total_mad": 378,
  "currency": "MAD",
  "status": "new",
  "source": "sehti.online",
  "page_url": "https://sehti.online/products/...",
  "event_id": "purchase_uuid",
  "meta_sent": true,
  "tiktok_sent": true,
  "notes": ""
}
```

## Google Apps Script

Use:

```text
docs/scripts/google_sheets_webhook.js
```

Setup:

1. Open the Google Sheet.
2. Go to `Extensions -> Apps Script`.
3. Paste the script.
4. Save.
5. Deploy -> New deployment -> Web app.
6. Execute as: `Me`.
7. Who has access: `Anyone`.
8. Copy web app URL.
9. Add it to backend env:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Reliability

Order creation must not fail just because the sheet webhook fails.

Recommended logic:

1. Create order in DB.
2. Try sending sheet webhook.
3. If success, set `sheet_synced_at`.
4. If fail, keep order and log error.
5. Later add a retry job/admin action if needed.

## Sheet Status Workflow

Initial status from backend:

```text
new
```

Manual sheet statuses:

- `new`
- `called_no_answer`
- `confirmed`
- `cancelled`
- `shipped`
- `delivered`
- `returned`

For COD, delivery rate depends on fast confirmation. Use the sheet to call new orders fast.
