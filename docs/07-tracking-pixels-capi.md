# Tracking: Meta Pixel, TikTok Pixel, CAPI, Events API

## Goals

Track the full funnel without slowing down the website:

- PageView
- ViewContent
- AddToCart
- InitiateCheckout
- Purchase

Use browser events for immediate platform tracking and backend server events for stronger attribution.

## Key Rules Confirmed From Current Docs

- Next.js supports `next/script` strategies like `lazyOnload` to load low-priority third-party scripts after page resources are fetched.
- Meta Conversions API supports `event_id`, `fbp`, `fbc`, `user_data.ph`, `custom_data.value`, `currency`, `content_ids`, `contents`, and `action_source`.
- Meta browser Pixel deduplication uses the same `eventID` as backend CAPI `event_id`.
- TikTok Events API / Pixel SDK supports `event_id` for deduplication between browser and server events.
- TikTok user fields such as `phone_number`, `email`, and `external_id` require SHA-256 hashing.
- Do not hash in frontend for this project. Send raw phone only to backend order endpoint; backend normalizes and hashes for CAPI/Events API.

## Frontend Pixel Loading

Use a single client component:

```text
frontend/components/tracking/Pixels.tsx
```

Load scripts globally in `app/layout.tsx`.

Use `next/script`.

Recommended strategy:

- Initialize lightweight inline stubs after interaction.
- Load external pixel scripts with `lazyOnload` where possible.
- Fire important events only after scripts are available; queue if needed.

Example:

```tsx
<Script id="meta-pixel" strategy="lazyOnload">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
    fbq('track', 'PageView');
  `}
</Script>
```

TikTok:

```tsx
<Script id="tiktok-pixel" strategy="lazyOnload">
  {`
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
      ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
      ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
      ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
      var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
      var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}');
      ttq.page();
    }(window, document, 'ttq');
  `}
</Script>
```

## Event ID Deduplication

Generate one event ID per event in frontend:

```ts
export function createEventId(eventName: string) {
  return `${eventName}_${crypto.randomUUID()}`
}
```

Use the same event ID for:

- Browser pixel event.
- Backend order payload.
- Backend Meta CAPI event.
- Backend TikTok Events API event.

Meta browser:

```ts
fbq("track", "Purchase", { value: 378, currency: "MAD" }, { eventID })
```

Meta server:

```json
{
  "event_name": "Purchase",
  "event_id": "same-event-id",
  "event_time": 1762902353,
  "action_source": "website"
}
```

TikTok browser:

```ts
ttq.track("CompletePayment", {
  value: 378,
  currency: "MAD",
  contents,
}, {
  event_id: eventId
})
```

TikTok server:

```json
{
  "event": "CompletePayment",
  "event_id": "same-event-id"
}
```

## Funnel Events

### PageView

Fire automatically after pixel loads.

### ViewContent

Fire on product pages.

Payload:

```json
{
  "content_ids": ["miswak-powder"],
  "content_type": "product",
  "content_name": "مسحوق المسواك الطبيعي ضد حساسية الأسنان",
  "value": 199,
  "currency": "MAD"
}
```

### AddToCart

Fire when product offer is added to cart.

Payload:

```json
{
  "content_ids": ["miswak-powder"],
  "content_type": "product",
  "contents": [
    { "id": "miswak-powder", "quantity": 2, "item_price": 279 }
  ],
  "value": 279,
  "currency": "MAD"
}
```

### InitiateCheckout

Fire when checkout popup opens.

Payload:

```json
{
  "contents": [
    { "id": "miswak-powder", "quantity": 2, "item_price": 279 }
  ],
  "value": 279,
  "currency": "MAD",
  "num_items": 2
}
```

### Purchase

Fire after backend completes the order.

Important:

- Browser `Purchase` and server `Purchase` must share event ID.
- Include upsell if accepted.

Payload:

```json
{
  "value": 378,
  "currency": "MAD",
  "content_ids": ["miswak-powder", "digestive-herbs"],
  "content_type": "product",
  "contents": [
    { "id": "miswak-powder", "quantity": 2, "item_price": 279 },
    { "id": "digestive-herbs", "quantity": 1, "item_price": 99 }
  ]
}
```

## Cookies And Click IDs

Frontend should collect and pass to backend:

- `_fbp`
- `_fbc`
- `_ttp`
- `fbclid` from URL.
- `ttclid` from URL.

If `fbclid` exists and `_fbc` does not, create `fbc` format:

```text
fb.1.<timestamp_ms>.<fbclid>
```

Do not create fake values if neither cookie nor click ID exists.

## Backend Hashing

Use SHA-256 hex lowercase.

Normalize phone:

```text
0612345678 -> +212612345678 -> 212612345678 for hashing
```

Python:

```python
import hashlib

def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode("utf-8")).hexdigest()

def normalize_ma_phone(raw: str) -> tuple[str, str]:
    digits = "".join(ch for ch in raw if ch.isdigit())
    if len(digits) == 10 and digits.startswith("0") and digits[1] in "567":
        local = digits
        e164 = "+212" + digits[1:]
        return local, e164
    raise ValueError("Invalid Moroccan phone number")

def phone_hash_for_pixels(e164: str) -> str:
    return sha256_hex(e164.replace("+", ""))
```

## Meta CAPI Purchase Payload

Endpoint:

```text
POST https://graph.facebook.com/v25.0/{META_PIXEL_ID}/events
```

Payload:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1762902353,
      "event_id": "same-event-id",
      "event_source_url": "https://sehti.online/products/...",
      "action_source": "website",
      "user_data": {
        "ph": ["sha256_phone"],
        "client_ip_address": "customer-ip",
        "client_user_agent": "browser-ua",
        "fbp": "fb.1...",
        "fbc": "fb.1..."
      },
      "custom_data": {
        "value": 378,
        "currency": "MAD",
        "content_ids": ["miswak-powder", "digestive-herbs"],
        "content_type": "product",
        "contents": [
          { "id": "miswak-powder", "quantity": 2, "item_price": 279 },
          { "id": "digestive-herbs", "quantity": 1, "item_price": 99 }
        ]
      }
    }
  ],
  "access_token": "META_ACCESS_TOKEN"
}
```

For testing, include:

```json
{
  "test_event_code": "TEST123"
}
```

## TikTok Events API Notes

Use server-side TikTok event with:

- `pixel_code`
- `event`
- `event_id`
- `timestamp`
- `context.user.phone_number` hashed
- `context.user.ttp`
- `context.ad.callback` for `ttclid` where supported
- `properties.value`
- `properties.currency`
- `properties.contents`

Use `+212` phone only for display/storage. Hash digits-only or E.164 consistently for Events API. The implementation should normalize to digits-only `212612345678`, SHA-256 hash it, and send that hash.

## Frontend Tracking Library

Create:

```text
frontend/lib/tracking.ts
```

Functions:

```ts
trackViewContent(product)
trackAddToCart(cartItem)
trackInitiateCheckout(cart)
trackPurchase(order)
collectAttribution()
```

Keep no tracking code directly inside product/cart/checkout components except calling these functions.

## Privacy And Consent

MVP can load pixels by default, but include clear policy page language about analytics and advertising cookies.

Future improvement:

- Cookie consent banner if needed for compliance/ads account safety.

## Speed Rules

- Pixels deferred/lazy.
- Do not block first contentful paint.
- Do not wait for pixels before allowing checkout.
- If CAPI fails, order must still be created and sheet webhook still attempted.
- Track failures in logs, not in user flow.
