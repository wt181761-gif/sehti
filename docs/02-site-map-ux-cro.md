# Site Map, UX, And CRO Flow

## Site Map

Required public pages:

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

There must be no cart page. The cart is a drawer available globally.

If `/cart` exists for compatibility, it must redirect to `/` and open the cart drawer.

## Global Layout

Header:

```text
[Right] S circle + صحتي / SEHTI
[Center] الرئيسية | المنتجات | من نحن | تواصل معنا
[Left] cart icon + item count
```

Mobile:

- Brand lockup on right.
- Cart icon visible.
- Hamburger menu.
- Cart drawer takes most/full width.

Footer:

- Brand story short text.
- Product links.
- Policy links.
- Contact link.
- Trust badges.
- Copyright.

Footer trust badges:

- `الدفع عند الاستلام`
- `توصيل مجاني`
- `ضمان الرضا 30 يوم`
- `منتجات طبيعية`

## Homepage Structure

Goal: Make visitors believe `صحتي` is a real Moroccan natural health brand before they see products.

Recommended order:

1. Announcement/trust bar:
   - `الدفع عند الاستلام`
   - `توصيل مجاني`
   - `ضمان الرضا 30 يوم`
   - `منتجات طبيعية مختارة بعناية`

2. Hero:
   - Right side: text.
   - Left side: sample lifestyle/product collage image placeholder.
   - Headline:
     ```text
     صحتي: حلول طبيعية لمشاكل يومية كتأثر على راحتك وثقتك
     ```
   - Subheadline:
     ```text
     3 منتجات طبيعية مركزة ضد حساسية الأسنان، الانتفاخ، وآلام المفاصل. مكونات معروفة، شرح علمي بسيط، والدفع عند الاستلام.
     ```
   - CTA: `تسوق المنتجات`
   - Secondary CTA: `تعرف على صحتي`

3. Problem cards:
   - Tooth sensitivity and confidence.
   - Bloating and discomfort after food.
   - Joint/back pain and daily movement.

4. Why Sehti is different:
   - Not generic.
   - One product = one problem.
   - Moroccan language, Moroccan trust, ingredient proof.

5. Featured products:
   - 3 product cards.
   - Each card includes heading, subheading, stars, price, CTA.
   - No discounts shown.

6. Authority section:
   - Ingredients selected for a reason.
   - Science explained simply.
   - Natural tradition.
   - Transparent guarantee.

7. UGC/social proof section:
   - Video placeholders.
   - Reviews from Moroccan names/cities.
   - Star rating.

8. COD reassurance:
   - How ordering works in 3 steps.
   - `املأ الاسم ورقم الهاتف`
   - `نتصل بك لتأكيد الطلب`
   - `تستلم وتدفع عند الباب`

9. Final CTA:
   - `اختر المنتج المناسب لك الآن`

## Collection Page Structure

Goal: Help users compare the 3 products and add one or more to cart.

Sections:

1. Page hero:
   ```text
   منتجات صحتي الطبيعية
   ```

2. Offer strip:
   - 1 product: `199 درهم`
   - 2 products: `279 درهم`
   - 3 products: `349 درهم`
   - Message:
     ```text
     الخصم يُحسب تلقائياً في السلة عند إضافة أكثر من منتج
     ```

3. Product grid:
   - 3 cards.
   - CTA on each: `أضف للسلة`
   - Secondary: `شاهد التفاصيل`

4. Trust section:
   - COD.
   - Free delivery.
   - Natural ingredients.
   - 30-day satisfaction guarantee.

## Product Page Structure

Each product page is a full landing page. Use alternating sections: text right/image left, then image right/text left.

Required structure:

1. Product hero:
   - Product name exactly as locked.
   - Emotional headline.
   - Stars and review count.
   - Price offer selector:
     - 1 piece: `199 MAD`
     - 2 pieces: `279 MAD`
     - 3 pieces: `349 MAD`
   - CTA adds selected offer to cart and opens cart drawer.
   - Trust strip.
   - Image placeholder.

2. Problem mirror:
   - Speak to the pain in Darija.
   - Show symptoms checklist.
   - Mention daily life moments.

3. Ingredient proof:
   - Each ingredient has: name, reason, proof/tradition, simple science explanation.
   - Use cards and icons.

4. How it works:
   - 3 steps only.
   - Explain mechanism simply, no medical cure claims.

5. Social proof:
   - UGC placeholders.
   - Reviews with Moroccan names/cities.
   - Specific before/after behavior.

6. Usage:
   - How to use.
   - How long it lasts.
   - When to expect first noticeable difference.

7. FAQ:
   - Safety.
   - Delivery.
   - COD.
   - Returns.
   - Time to see results.

8. Bottom cross-sells:
   - Show the other 2 products.
   - Prices are normal `199 MAD`.
   - No discount language here.

9. Sticky mobile CTA:
   - Offer selector + add to cart.
   - Always visible after hero.

## Cart Drawer

Cart drawer opens when:

- User clicks cart icon.
- User clicks any product CTA.
- User adds cross-sell.

Drawer content:

1. Header:
   - `سلة التسوق`
   - close button.

2. Items:
   - Product name.
   - Quantity.
   - Price.
   - Remove.

3. Offer calculation:
   - If 1 total item: total `199`.
   - If 2 total items: total `279`.
   - If 3 or more total items: total `349`.

4. AOV nudge:
   - If 1 item:
     ```text
     أضف منتجاً ثانياً وخلي المجموع 279 درهم فقط
     ```
   - If 2 items:
     ```text
     أضف المنتج الثالث وخلي المجموع 349 درهم فقط
     ```

5. Cross-sells:
   - Show products not currently in cart.
   - Normal price only.
   - Button: `أضف للسلة`.

6. Checkout CTA:
   - `أكمل الطلب`
   - Opens checkout popup.

## Checkout Popup

Checkout popup content:

1. Order summary.
2. COD reassurance:
   ```text
   الدفع عند الاستلام - لا تحتاج بطاقة بنكية
   ```
3. Social proof mini-line:
   ```text
   أكثر من 4100 زبون مغربي طلبوا من صحتي
   ```
4. Scarcity/urgency:
   ```text
   كمية اليوم محدودة بسبب ضغط الطلبات
   ```
5. Fields:
   - `الاسم الكامل`
   - `رقم الهاتف`

Phone validation:

- Frontend accepts Moroccan local format only: starts with `0`, exactly 10 digits.
- Examples:
  - `0612345678`
  - `0712345678`
  - `0522123456`

CTA:

```text
تأكيد الطلب
```

After valid submit, do not send immediately. Show the one-time upsell first.

## Post-Form Upsell

This is the only place where a discount is allowed.

Rules:

- Show for 10-15 seconds.
- Show only one product.
- Product must be relevant and not already in cart.
- Price: `99 MAD`.
- Original price shown as `199 MAD` with `-50%` badge.
- If customer accepts, add it to final order.
- If customer rejects or timer expires, submit original order.

Copy:

```text
لحظة قبل تأكيد طلبك...
عرض خاص يظهر مرة واحدة فقط
أضف [product] لطلبك الآن بـ 99 درهم فقط بدل 199 درهم
```

Buttons:

- Accept: `أضف العرض بـ 99 درهم`
- Decline: `لا شكراً، أكمل طلبي`

## Thank You Page

Goal: increase confirmation and delivery rate, reduce buyer remorse, and optionally sell more at normal price.

Required sections:

1. Confirmation hero:
   ```text
   طلبك وصلنا يا [Name]
   ```

2. Order summary:
   - Products.
   - Upsell product if accepted.
   - Total.
   - Phone.

3. Confirmation call priming:
   ```text
   سنتصل بك خلال دقائق من رقم مغربي لتأكيد الطلب. الرجاء الرد حتى نقدر نرسل طلبك بسرعة.
   ```

4. Delivery promise:
   - `24-48 ساعة في المدن الكبرى`
   - `الدفع عند الاستلام`
   - `افحص الطرد ثم ادفع`

5. Trust reinforcement:
   - Guarantee.
   - Customer count.
   - Natural ingredients.

6. Cross-sell products:
   - Show products not ordered.
   - Normal price `199 MAD`.
   - No discount.

## CRO Principles

- Reduce fields: only name and phone.
- Repeat COD reassurance near every CTA.
- Use Moroccan words, cities, and situations.
- Use real-looking reviews, not generic `منتج رائع`.
- Put offer logic in cart, not scattered across pages.
- Never show fake medical certainty.
- Always explain ingredients in simple proof language.
- Use sticky mobile CTA on product pages.
- Use cart drawer instead of forcing page navigation.
- Keep images warm, natural, and branded.
