# Development Rules

## Product And Pricing Source Of Truth

Keep products and prices in config files, not scattered across components.

Frontend:

```text
frontend/lib/products.ts
frontend/lib/offers.ts
```

Backend:

```text
backend/app/services/pricing.py
```

Backend always recalculates price. Frontend price is only for display.

## Component Rules

- Header and footer are global.
- Cart is a global drawer, not a page.
- Checkout is a global modal.
- Product page sections should be reusable across the 3 product pages.
- Product copy should live in product data/config, not hardcoded in page JSX.
- Pixel calls go through one tracking utility.
- API calls go through one API client utility.

## Copy Rules

- Arabic first.
- Moroccan situations and phrases.
- Avoid fake miracle claims.
- Every claim needs one of:
  - ingredient logic
  - tradition/culture
  - customer story
  - guarantee/risk reversal

## Design Rules

- Brand must feel premium-natural, not cheap dropshipping.
- Use warm cream backgrounds, deep green CTAs, gold accents.
- Use cards, rounded corners, soft shadows.
- Use real product placeholders until real images are ready.
- Do not use random unrelated stock images.
- Product sections alternate image/text direction on desktop.

## Performance Rules

- Defer web pixels.
- Optimize images.
- Avoid large animation libraries.
- Do not block checkout on tracking failures.
- Keep initial JS light.

## Backend Rules

- Validate every request with Pydantic.
- Normalize phone in one helper only.
- Hash identifiers before pixel APIs.
- Never expose tokens to frontend.
- Never trust frontend pricing.
- Store every order before trying sheet/pixel outbound calls.
- Sheet/pixel failures should be logged and not break order creation.

## Git Rules

- Commit docs, examples, migrations, Dockerfiles.
- Do not commit `.env`, `.env.local`, secrets, tokens, database passwords.
- Keep `.env.example` complete and up to date.

## Testing Checklist

- Product pages load on mobile and desktop.
- Offer selector changes price correctly.
- Add-to-cart opens drawer.
- Cart drawer cross-sells exclude products already in cart.
- Checkout validates name and phone.
- Invalid phone cannot proceed.
- Valid phone proceeds to upsell.
- Upsell accept adds 99 MAD item.
- Upsell decline submits original order.
- Timer expiry submits original order.
- Thank-you page displays correct total and items.
- Sheet receives all order fields.
- Meta browser and server event IDs match.
- TikTok browser and server event IDs match.
