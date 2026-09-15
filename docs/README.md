# Sehti Store Build Docs

These docs are the source of truth for building `sehti.online`, a Moroccan Arabic DTC COD store for premium-positioned natural health products.

## Product Scope

Brand: `صحتي`
English brand text: `SEHTI`
Frontend domain: `https://sehti.online`
Backend domain: `https://api.sehti.online`
Database name: `sehti`

Products:

1. `مسحوق المسواك الطبيعي ضد حساسية الأسنان`
2. `خليط الأعشاب الهاضمة ضد الانتفاخ`
3. `مزيج الكركم واللبان ضد آلام المفاصل`

Core pricing:

- 1 piece: `199 MAD`
- 2 pieces: `279 MAD`
- 3 pieces: `349 MAD`
- Post-form one-time upsell only: `99 MAD`

## Required Folders To Build

The AI coder must deliver:

```text
frontend/
backend/
docs/
```

Frontend: Next.js, React, TypeScript, Tailwind, RTL Arabic, responsive, DTC CRO.

Backend: Python FastAPI, PostgreSQL, migrations on startup, order creation, sheet webhook forwarding, Meta CAPI, TikTok Events API.

## Docs Map

- `01-brand-positioning-icp.md`: Brand identity, positioning, Moroccan trust psychology, ICP.
- `02-site-map-ux-cro.md`: Full page map, funnels, cart drawer, checkout popup, thank-you CRO.
- `FRONTEND.md`: Dedicated frontend build specification.
- `03-frontend-architecture.md`: Next.js architecture, components, libraries, design rules.
- `04-backend-architecture-fastapi.md`: FastAPI service, DB schema, endpoints, migrations, validation.
- `05-products-offers-aov.md`: Products, offers, bundles, cart logic, upsell decision tree.
- `06-copywriting-product-pages.md`: Moroccan Arabic copy, emotional hooks, proof-backed sections.
- `07-tracking-pixels-capi.md`: Meta Pixel, TikTok Pixel, server-side CAPI/Events API, deduplication.
- `08-deployment-docker-env.md`: Docker, EasyPanel, env examples, GitHub readiness.
- `09-google-sheets.md`: Google Sheets webhook script and sheet columns.
- `10-ai-coder-prompt.md`: Final prompt to give the AI coder.
- `11-development-rules.md`: Coding, design, backend, tracking, and testing rules.
- `templates/frontend.env.example`: Ready-to-copy frontend env example.
- `templates/backend.env.example`: Ready-to-copy backend env example.
- `templates/orders-sheet-template.csv`: Google Sheets order columns.
- `templates/products-template.csv`: Product catalog template.
- `scripts/google_sheets_webhook.js`: Apps Script webhook for Google Sheets.

## Non-Negotiables

- No Shopify.
- No cart page. Use a cart drawer everywhere.
- COD only.
- Checkout popup has only 2 fields: name and Moroccan phone number.
- Phone must start with `0` and be 10 digits in frontend validation.
- Backend must normalize phone for tracking, including `+212` format where needed.
- No discount shown anywhere except the post-form upsell.
- Cross-sells on site, product pages, cart drawer, and thank-you page use normal price.
- Web pixels load deferred/lazily for speed.
- Meta/TikTok server events use the same event ID as browser events for deduplication.
- Phone/email identifiers must be SHA-256 hashed on the backend before CAPI/Events API.
- Do not commit real secrets. Use `.env.example` placeholders.
