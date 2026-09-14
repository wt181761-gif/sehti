# Products, Offers, Cart Logic, And AOV

## Locked Products

Use these names everywhere: cards, product pages, cart drawer, checkout summary, sheet rows, tracking payloads.

| Product ID | Arabic Name | Main Problem | Primary Emotion |
|---|---|---|---|
| `miswak-powder` | `مسحوق المسواك الطبيعي ضد حساسية الأسنان` | Sensitive teeth, breath, smile confidence | Embarrassment, social confidence |
| `digestive-herbs` | `خليط الأعشاب الهاضمة ضد الانتفاخ` | Bloating, heaviness after meals | Shame, discomfort, wanting lightness |
| `turmeric-boswellia` | `مزيج الكركم واللبان ضد آلام المفاصل` | Joint/back pain | Pain, fear of losing mobility |

## Offer Rules

Each product has the same offer ladder:

| Offer | Price | Savings vs 199 each | Label |
|---|---:|---:|---|
| 1 piece | 199 MAD | 0 MAD | `جربه الآن` |
| 2 pieces | 279 MAD | 119 MAD | `الأكثر اختياراً` |
| 3 pieces | 349 MAD | 248 MAD | `أفضل قيمة` |

Offer prices can change later, so the coder must keep them in one config file:

```ts
export const offerTiers = [
  { qty: 1, price: 199, label: "جربه الآن" },
  { qty: 2, price: 279, label: "الأكثر اختياراً" },
  { qty: 3, price: 349, label: "أفضل قيمة" },
] as const
```

## Discount Rules

Never show a discounted product price on:

- Homepage.
- Collection page.
- Product page bottom cross-sells.
- Cart drawer cross-sells.
- Thank-you page cross-sells.

The only discounted product is the post-form upsell:

```text
99 درهم بدل 199 درهم
```

## Product Card Requirements

Each product card must show:

- Product image placeholder.
- Product name.
- Strong heading/subheading.
- Star rating.
- Normal price from `199 MAD`.
- Small COD badge.
- CTA: `أضف للسلة`.
- Secondary link: `شاهد التفاصيل`.

Card copy examples:

### Miswak

Heading:

```text
حساسية الأسنان والرائحة؟
```

Subheading:

```text
مسحوق مسواك طبيعي يساعدك تبتسم بثقة وتشرب القهوة بلا خوف.
```

### Digestive

Heading:

```text
كرشك كتنفخ بعد الماكلة؟
```

Subheading:

```text
خليط أعشاب هاضمة لراحة البطن والخفة بعد الوجبات.
```

### Joint

Heading:

```text
ألم الظهر والمفاصل؟
```

Subheading:

```text
مزيج الكركم واللبان لدعم الحركة والراحة اليومية.
```

## Product Page Offer Selector

On each product page, show the offer selector near the hero CTA and sticky mobile CTA.

Default selected offer: 2 pieces at `279 MAD`.

Reason: Higher AOV by default while still feeling like a bargain.

CTA:

```text
أضف العرض للسلة
```

After click:

1. Add selected offer to cart.
2. Open cart drawer.
3. Show cross-sells inside cart.

## Cart Drawer Cross-Sells

Show products not already in cart.

Copy:

```text
أكمل طلبك مع منتج آخر من صحتي
```

Do not show discount.

Button:

```text
أضف بـ 199 درهم
```

## Post-Form Upsell Decision Tree

Show exactly one product.

Priority should depend on what is in cart:

1. If cart has `miswak-powder`, upsell `digestive-herbs`.
   - Reason: same younger/women/beauty-health buyer can relate to bloating.
2. If cart has `digestive-herbs`, upsell `miswak-powder`.
   - Reason: both are daily hygiene/self-confidence products.
3. If cart has `turmeric-boswellia`, upsell `digestive-herbs`.
   - Reason: older pain audience may also suffer stomach issues, especially from pills.
4. If cart has 2 products, upsell the missing one.
5. If cart has all 3 products, skip upsell.

Upsell copy:

```text
لحظة قبل تأكيد طلبك...
عرض خاص يظهر مرة واحدة فقط
أضف [product_name] لطلبك الآن بـ 99 درهم فقط
```

Timer:

- 12 seconds recommended.
- It may auto-submit original order when expired.

Buttons:

```text
أضف العرض بـ 99 درهم
لا شكراً، أكمل طلبي
```

## Order Total Examples

One product, 1 piece:

```text
مسحوق المسواك الطبيعي ضد حساسية الأسنان - 199 MAD
Total: 199 MAD
```

One product, 2 pieces:

```text
خليط الأعشاب الهاضمة ضد الانتفاخ - 2 pieces offer - 279 MAD
Total: 279 MAD
```

Two different products:

```text
مسحوق المسواك الطبيعي ضد حساسية الأسنان - 1 piece - 199 MAD
خليط الأعشاب الهاضمة ضد الانتفاخ - 1 piece - 199 MAD
Total: 398 MAD
```

One product 2-piece offer + accepted upsell:

```text
مسحوق المسواك الطبيعي ضد حساسية الأسنان - 2 pieces - 279 MAD
خليط الأعشاب الهاضمة ضد الانتفاخ - post-form upsell - 99 MAD
Total: 378 MAD
```

## AOV Strategy

Primary AOV levers:

- Default product-page selection is `2 pieces / 279 MAD`.
- Cart drawer shows cross-sells at normal price.
- Checkout popup creates urgency and confidence.
- One-time 99 MAD post-form upsell captures impulse after commitment.
- Thank-you page lets customer add missing products at normal price.

Do not overcomplicate early MVP with subscriptions, quizzes, SMS, or WhatsApp.
