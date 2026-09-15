# FRONTEND Build Specification

This is the dedicated frontend document for `sehti.online`.

Use this together with:

- `docs/01-brand-positioning-icp.md`
- `docs/02-site-map-ux-cro.md`
- `docs/03-frontend-architecture.md`
- `docs/05-products-offers-aov.md`
- `docs/06-copywriting-product-pages.md`
- `docs/07-tracking-pixels-capi.md`
- `docs/11-development-rules.md`

## Goal

Build a Moroccan Arabic DTC branded storefront that makes `صحتي / SEHTI` look like it owns the products and can sell them at premium prices.

The frontend must maximize:

- Trust.
- Authority.
- AOV.
- Add-to-cart rate.
- Checkout completion.
- Confirmation and delivery rate.

## Stack

Use:

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Zustand for cart drawer state.
- React Hook Form + Zod for checkout form validation.
- `next/script` for deferred Meta/TikTok pixels.
- `next/image` for optimized images/placeholders.

## Brand Header

RTL layout:

```text
[Right] S circle + صحتي / SEHTI | Menu | Cart [Left]
```

Brand mark:

- `S` inside a circle.
- Circle color: `#123C2D`.
- Letter color: `#FAF6ED` or `#C8A24A`.

Logo text:

```text
صحتي
SEHTI
```

Menu:

```text
الرئيسية
المنتجات
من نحن
تواصل معنا
```

Cart:

- Icon with item count.
- Opens cart drawer.
- No cart page.

## Required Pages

```text
/
/collections
/products/miswak-natural-powder-sensitive-teeth
/products/digestive-herbal-blend-bloating
/products/turmeric-boswellia-joint-pain
/about
/contact
/policies/shipping
/policies/returns
/policies/privacy
/policies/terms
/thank-you
```

## Products

Use these exact names everywhere:

```text
مسحوق المسواك الطبيعي ضد حساسية الأسنان
خليط الأعشاب الهاضمة ضد الانتفاخ
مزيج الكركم واللبان ضد آلام المفاصل
```

## Pricing

For each product:

```text
1 piece = 199 MAD
2 pieces = 279 MAD
3 pieces = 349 MAD
```

Only discount allowed:

```text
Post-form upsell = 99 MAD
```

Do not show discounts anywhere else.

## Homepage Structure

1. Trust bar:
   - `الدفع عند الاستلام`
   - `توصيل مجاني`
   - `ضمان الرضا 30 يوم`

2. Hero:
   - Text right.
   - Sample branded product image left.
   - Headline:
     ```text
     صحتي: حلول طبيعية لمشاكل يومية كتأثر على راحتك وثقتك
     ```
   - CTA:
     ```text
     تسوق المنتجات
     ```

3. Three problem cards:
   - Teeth sensitivity.
   - Bloating.
   - Joint/back pain.

4. Brand authority:
   - Natural ingredients.
   - Moroccan trust.
   - Ingredient science.
   - Real social proof.

5. Product cards.

6. How COD works.

7. Reviews/UGC placeholders.

8. Final CTA.

## Collection Page

Show:

- Page hero.
- Offer pricing strip.
- 3 product cards.
- Authority/trust badges.
- CTA on each product.

Product card must include:

- Sample product image.
- Product name.
- Emotional heading.
- Subheading.
- Stars.
- Normal price.
- CTA: `أضف للسلة`.
- Link: `شاهد التفاصيل`.

## Product Pages

Each product page is a landing page.

Required sections:

1. Hero with offer selector.
2. Problem mirror in Moroccan Arabic.
3. Symptoms checklist.
4. Ingredient proof.
5. How it works.
6. UGC/social proof.
7. How to use.
8. Guarantee.
9. FAQ.
10. Bottom cross-sells at normal price.
11. Sticky mobile CTA.

Desktop layout:

- Alternate sections.
- Section 1: text right, image left.
- Section 2: image right, text left.
- Continue alternating.

Mobile:

- One column.
- Sticky CTA.
- Fast cart drawer.

## Cart Drawer

No cart page.

Cart drawer opens when:

- Cart icon clicked.
- Product CTA clicked.
- Cross-sell added.

Drawer must show:

- Items.
- Offer selected.
- Quantity/offer controls.
- Remove.
- Total.
- Cross-sells not already in cart.
- Checkout CTA.

Cross-sells:

- Normal price only.
- No discount.
- Button:
  ```text
  أضف بـ 199 درهم
  ```

## Checkout Popup

Opened from cart drawer.

Must show:

- Order summary.
- Social proof.
- Scarcity line.
- COD reassurance.

Fields:

```text
الاسم الكامل
رقم الهاتف
```

Phone validation:

- Starts with `0`.
- Exactly 10 digits.
- Moroccan mobile/landline format.
- Example under field:
  ```text
  مثال: 0612345678
  ```

CTA:

```text
تأكيد الطلب
```

After valid form:

1. Call backend `/api/orders/prepare`.
2. Show one upsell for 10-15 seconds.
3. If accepted, add 99 MAD upsell.
4. If declined or timer expires, submit original order.
5. Call backend `/api/orders/complete`.
6. Redirect to thank-you.

## Upsell Step

Only place where discount appears.

Show:

```text
لحظة قبل تأكيد طلبك...
عرض خاص يظهر مرة واحدة فقط
أضف [product] بـ 99 درهم فقط بدل 199 درهم
```

Timer:

- 12 seconds recommended.

Buttons:

```text
أضف العرض بـ 99 درهم
لا شكراً، أكمل طلبي
```

## Thank You Page

Must increase confirmation/delivery rate.

Show:

- Order confirmed.
- Customer name.
- Order summary.
- Upsell item if accepted.
- Total.
- Phone.
- Strong instruction to answer confirmation call.
- Delivery steps.
- COD reassurance.
- Cross-sells at normal price.

Copy:

```text
سنتصل بك خلال دقائق من رقم مغربي لتأكيد الطلب. الرجاء الرد حتى نقدر نرسل طلبك بسرعة.
```

## Tracking

Use frontend pixels:

- Meta Pixel.
- TikTok Pixel.

Events:

- PageView.
- ViewContent.
- AddToCart.
- InitiateCheckout.
- Purchase.

Rules:

- Load pixels deferred/lazy for speed.
- Generate `event_id`.
- Send same `event_id` to backend for CAPI dedup.
- Collect `_fbp`, `_fbc`, `_ttp`, `fbclid`, `ttclid`.
- Never expose server access tokens in frontend.

## Image Placeholders

Until final images are ready, create branded sample placeholders:

- Product mockup card/jar.
- Cream background.
- Green/gold accents.
- Ingredient icons.
- Text:
  ```text
  صورة المنتج قريباً
  ```

Do not use random stock photos.

## Frontend Acceptance Checklist

- Header matches required layout.
- All required pages exist.
- Product names are exact.
- Offer selector works.
- Cart drawer opens from product CTA.
- No cart page in normal flow.
- Cross-sells show normal price.
- Checkout validates Moroccan phone.
- Upsell appears only after valid form.
- Upsell discount is only shown there.
- Thank-you page shows correct summary.
- Site is responsive.
- Pixels are deferred and events fire.
