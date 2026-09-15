# Prompt For AI Coder

Use this prompt with the AI coder.

```text
You are building a production-ready DTC COD e-commerce store for Morocco.

Read and follow all docs in /docs before coding:

- docs/README.md
- docs/01-brand-positioning-icp.md
- docs/02-site-map-ux-cro.md
- docs/FRONTEND.md
- docs/03-frontend-architecture.md
- docs/04-backend-architecture-fastapi.md
- docs/05-products-offers-aov.md
- docs/06-copywriting-product-pages.md
- docs/07-tracking-pixels-capi.md
- docs/08-deployment-docker-env.md
- docs/09-google-sheets.md
- docs/11-development-rules.md
- docs/scripts/google_sheets_webhook.js
- docs/templates/orders-sheet-template.csv
- docs/templates/products-template.csv
- docs/templates/frontend.env.example
- docs/templates/backend.env.example

Build two folders:

frontend/
backend/

Brand:

- Arabic name: صحتي
- English name under logo: SEHTI
- Domain: sehti.online
- Backend domain: api.sehti.online
- Store language: Arabic / Moroccan Arabic, RTL.

Products:

1. مسحوق المسواك الطبيعي ضد حساسية الأسنان
2. خليط الأعشاب الهاضمة ضد الانتفاخ
3. مزيج الكركم واللبان ضد آلام المفاصل

Frontend requirements:

- Use Next.js App Router, React, TypeScript, Tailwind CSS.
- Responsive desktop/mobile.
- Use RTL globally.
- No Shopify.
- No cart page. Use cart drawer globally.
- Header: right side S inside circle with brand color, next to it صحتي and below it SEHTI, then menu, then cart.
- Pages:
  - /
  - /collections
  - /products/miswak-natural-powder-sensitive-teeth
  - /products/digestive-herbal-blend-bloating
  - /products/turmeric-boswellia-joint-pain
  - /about
  - /contact
  - /policies/shipping
  - /policies/returns
  - /policies/privacy
  - /policies/terms
  - /thank-you
- Build homepage to position صحتي as a trusted Moroccan DTC natural health brand.
- Product pages must be CRO landing pages with emotional copy, ingredient proof, social proof, authority, FAQs, image placeholders, and sticky mobile CTA.
- Use sample branded image placeholders where final images are missing.
- Desktop sections should alternate text/image direction.

Pricing:

- Each product offer:
  - 1 piece: 199 MAD
  - 2 pieces: 279 MAD
  - 3 pieces: 349 MAD
- Prices should be config-driven so they can change later.
- No discount anywhere except post-form upsell.

Cart drawer:

- Opens when product CTA is clicked.
- Shows items, offer qty, remove/update.
- Shows cross-sells for products not in cart at normal price.
- Checkout CTA opens checkout popup.

Checkout popup:

- Show order summary, COD reassurance, social proof, scarcity.
- Only 2 fields:
  - name
  - phone
- Phone validation:
  - Moroccan local number only
  - starts with 0
  - exactly 10 digits
  - examples under field: 0612345678
- On valid form submit:
  - call backend /api/orders/prepare
  - show 10-15 second one-time upsell
  - show only one relevant product not already in cart
  - upsell price: 99 MAD
  - if accepted, include upsell in final order
  - if declined or timer expires, complete original order
  - call backend /api/orders/complete
  - route to thank-you page

Thank-you page:

- Show confirmation and order summary.
- If upsell accepted, show it in summary.
- Strong copy to increase confirmation/delivery:
  - Tell customer they will receive a confirmation call.
  - Tell them to answer the call.
  - Explain delivery steps.
  - Reassure COD and free delivery.
- Show products not ordered at normal 199 MAD cross-sell price.

Backend requirements:

- Use Python FastAPI.
- Use PostgreSQL database named sehti.
- Use SQLAlchemy async + asyncpg.
- Use Alembic migrations.
- Run migrations on backend startup.
- Use Pydantic v2 validation.
- Expose:
  - GET /health
  - POST /api/orders/prepare
  - POST /api/orders/complete
- Backend must recalculate all pricing. Do not trust frontend prices.
- Backend validates Moroccan phone and normalizes:
  - local: 0612345678
  - E.164: +212612345678
  - tracking hash input: 212612345678
- Backend sends final order to Google Sheets webhook.
- Backend sends Meta CAPI Purchase event.
- Backend sends TikTok Events API Purchase/CompletePayment event.
- If sheet or pixel API fails, order must still be created.

Tracking:

- Include Meta Pixel and TikTok Pixel on frontend.
- Use next/script and defer/lazy-load scripts for speed.
- Track PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
- Generate event_id on frontend.
- Use same event_id for browser pixel and backend CAPI/Events API deduplication.
- Collect and pass _fbp, _fbc, _ttp, fbclid, ttclid to backend.
- Backend hashes phone with SHA-256 before Meta/TikTok.
- Do not expose access tokens in frontend.

Deployment:

- Create Dockerfile for frontend.
- Create Dockerfile for backend.
- Create backend entrypoint.sh that runs alembic upgrade head then starts uvicorn.
- Create .env.example for frontend and backend.
- Make the repo GitHub-ready with .gitignore.
- Use EasyPanel-ready ports:
  - frontend 3000
  - backend 8000

Important:

- Do not use the real database password in committed files.
- Use env placeholders only.
- Keep code clean and maintainable.
- Build for high CRO, trust, authority, Moroccan ICP emotion, and high AOV.
- Follow every detail in /docs.

Deliver working frontend and backend code, not only docs.
```
