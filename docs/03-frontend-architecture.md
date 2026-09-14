# Frontend Architecture

## Stack

Use:

- Next.js 16 or latest stable with App Router.
- React 19.
- TypeScript strict mode.
- Tailwind CSS v4.
- Zustand for cart drawer state.
- React Hook Form + Zod for checkout validation.
- `next/script` for deferred web pixels.
- `next/image` for optimized sample/product images.
- Optional animation: `framer-motion` only for drawer/modal transitions if needed.

Do not use:

- Shopify.
- Heavy UI kits.
- Client-side global data fetching libraries unless needed.
- A cart page.

## Project Structure

```text
frontend/
  app/
    layout.tsx
    page.tsx
    collections/page.tsx
    about/page.tsx
    contact/page.tsx
    thank-you/page.tsx
    products/[slug]/page.tsx
    policies/
      shipping/page.tsx
      returns/page.tsx
      privacy/page.tsx
      terms/page.tsx
  components/
    layout/
      Header.tsx
      Footer.tsx
      TrustBar.tsx
    cart/
      CartDrawer.tsx
      CartItemRow.tsx
      CartCrossSell.tsx
    checkout/
      CheckoutModal.tsx
      UpsellStep.tsx
      OrderSummary.tsx
    product/
      ProductCard.tsx
      OfferSelector.tsx
      IngredientCard.tsx
      ReviewCard.tsx
      ProductHero.tsx
      StickyProductCta.tsx
    tracking/
      Pixels.tsx
  lib/
    products.ts
    offers.ts
    cart-store.ts
    tracking.ts
    phone.ts
    api.ts
  public/
    images/
      placeholders/
```

## Environment

Create `frontend/.env.example`:

```env
NEXT_PUBLIC_SITE_URL=https://sehti.online
NEXT_PUBLIC_API_URL=https://api.sehti.online

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=

# Optional test/debug flags
NEXT_PUBLIC_TRACKING_DEBUG=false
```

## Routing

Use static product routes:

```ts
const products = [
  {
    id: "miswak-powder",
    slug: "miswak-natural-powder-sensitive-teeth",
    nameAr: "مسحوق المسواك الطبيعي ضد حساسية الأسنان",
  },
  {
    id: "digestive-herbs",
    slug: "digestive-herbal-blend-bloating",
    nameAr: "خليط الأعشاب الهاضمة ضد الانتفاخ",
  },
  {
    id: "turmeric-boswellia",
    slug: "turmeric-boswellia-joint-pain",
    nameAr: "مزيج الكركم واللبان ضد آلام المفاصل",
  },
]
```

## Cart State

Use Zustand with persistence.

Cart item shape:

```ts
type CartItem = {
  productId: string
  offerQty: 1 | 2 | 3
  unitLabel: "1_piece" | "2_pieces" | "3_pieces"
  price: 199 | 279 | 349
}
```

Important: offer quantity is per product. If user chooses `2 pieces` for the same product, cart item price is `279`, not `199 * 2`.

Cart can support multiple product offers. Example:

- 2 pieces of miswak = 279
- 1 digestive = 199
- Cart total = 478

For early MVP, it is acceptable to allow one offer per product and update the existing item when the same product is added again.

## Offer Selector

Every product page must include offer selector:

```text
1 قطعة - 199 درهم
2 قطع - 279 درهم
3 قطع - 349 درهم
```

Best visual:

- Three cards.
- Highlight `3 قطع` as best value.
- Use savings text:
  - 2 pieces: `وفّر 119 درهم`
  - 3 pieces: `وفّر 248 درهم`

CTA:

```text
أضف العرض للسلة
```

Click behavior:

1. Add selected product offer to cart.
2. Open cart drawer.
3. Fire `AddToCart` web pixel event.

## Checkout API Call

Frontend sends validated checkout request to backend:

```ts
POST `${NEXT_PUBLIC_API_URL}/api/orders/prepare`
```

Payload:

```json
{
  "customer_name": "محمد العلوي",
  "phone": "0612345678",
  "items": [
    {
      "product_id": "miswak-powder",
      "product_name": "مسحوق المسواك الطبيعي ضد حساسية الأسنان",
      "offer_qty": 2,
      "price": 279
    }
  ],
  "event_id": "uuid-generated-on-frontend",
  "fbp": "fb.1...",
  "fbc": "fb.1...",
  "ttp": "_ttp cookie value",
  "ttclid": "ttclid from URL if present",
  "page_url": "https://sehti.online/products/..."
}
```

Backend returns:

```json
{
  "order_token": "temporary-order-token",
  "upsell_product_id": "digestive-herbs",
  "upsell_price": 99,
  "expires_in_seconds": 12
}
```

Then frontend shows upsell.

Final confirmation:

```ts
POST `${NEXT_PUBLIC_API_URL}/api/orders/complete`
```

Payload:

```json
{
  "order_token": "temporary-order-token",
  "accepted_upsell": true
}
```

Backend stores order, sends sheet webhook, sends CAPI events, and returns final order summary for thank-you page.

## Image Placeholders

Since real images will be provided later, use branded placeholders:

- Warm cream background.
- Product jar/sachet/card mockup block.
- Ingredient icons.
- Arabic labels on placeholder.
- Avoid random stock-looking photos.

Image sections:

- Homepage hero: product family collage placeholder.
- Collection page: product card placeholders.
- Each product page: 3-4 placeholders:
  - Hero product.
  - Ingredient closeup.
  - Lifestyle/use moment.
  - UGC/testimonial video frame.

## Responsive Rules

Desktop:

- Max content width: `1120px` or `1200px`.
- Hero: two columns, text right, image left.
- Alternate sections on product pages.
- Cart drawer width: `420px`.

Mobile:

- Single column.
- Sticky CTA on product pages.
- Drawer width: full screen or 92%.
- Header compact.
- Offer cards stack or horizontal scroll.

## Performance Rules

- Use `next/image`.
- Use `next/script` with lazy/deferred strategy for pixels.
- Do not block rendering with analytics.
- Avoid heavy animation libraries unless needed.
- Minimize custom fonts to 2 font families.
- Use SVG/icons from CSS or inline, not heavy icon packs unless tree-shaken.

## Accessibility

- Buttons must be real `<button>`.
- Cart drawer and checkout modal must trap focus if possible.
- Escape closes drawer/modal.
- Form errors must be visible under fields.
- Arabic direction set at root:

```tsx
<html lang="ar-MA" dir="rtl">
```

## Coding Rules

- Components should be small and named clearly.
- No hardcoded product data inside components; use `lib/products.ts`.
- No direct pixel calls scattered across UI; use `lib/tracking.ts`.
- No direct backend URL strings in components; use `lib/api.ts`.
- Keep all copy in product data or constants where possible.
- No fake loaded testimonial images; use explicit placeholders until real assets exist.
