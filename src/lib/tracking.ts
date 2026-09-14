"use client";

/**
 * Tracking utility for صحتي (SEHTI).
 * Centralises all pixel calls — nothing should call fbq/ttq directly.
 * Never blocks checkout or throws to the caller.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, data?: object, opts?: object) => void;
      page: () => void;
    };
  }
}

// ── Event ID generation ──────────────────────────────────────────────────────

export function createEventId(eventName: string): string {
  const uid =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${eventName}_${uid}`;
}

// ── Cookie / attribution helpers ─────────────────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function getUrlParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export interface Attribution {
  fbp: string | null;
  fbc: string | null;
  ttp: string | null;
  ttclid: string | null;
}

export function collectAttribution(): Attribution {
  const fbp = getCookie("_fbp");
  let fbc = getCookie("_fbc");
  const ttp = getCookie("_ttp");
  const fbclid = getUrlParam("fbclid");
  const ttclid = getUrlParam("ttclid");

  // Build fbc from fbclid if cookie absent
  if (!fbc && fbclid) {
    fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbp, fbc, ttp, ttclid };
}

// ── Pixel helpers ─────────────────────────────────────────────────────────────

function metaTrack(event: string, data: object, eventId: string) {
  try {
    window.fbq?.("track", event, data, { eventID: eventId });
  } catch {
    // never throw
  }
}

function tiktokTrack(event: string, data: object, eventId: string) {
  try {
    window.ttq?.track(event, data, { event_id: eventId });
  } catch {
    // never throw
  }
}

// ── Public tracking functions ─────────────────────────────────────────────────

export function trackViewContent(opts: {
  productId: string;
  productNameAr: string;
  price: number;
  eventId?: string;
}) {
  const eventId = opts.eventId ?? createEventId("ViewContent");
  const data = {
    content_ids: [opts.productId],
    content_type: "product",
    content_name: opts.productNameAr,
    value: opts.price,
    currency: "MAD",
  };
  metaTrack("ViewContent", data, eventId);
  tiktokTrack("ViewContent", { value: opts.price, currency: "MAD", contents: [{ content_id: opts.productId }] }, eventId);
  return eventId;
}

export function trackAddToCart(opts: {
  productId: string;
  productNameAr: string;
  offerQty: number;
  price: number;
  eventId?: string;
}) {
  const eventId = opts.eventId ?? createEventId("AddToCart");
  const data = {
    content_ids: [opts.productId],
    content_type: "product",
    contents: [{ id: opts.productId, quantity: opts.offerQty, item_price: opts.price }],
    value: opts.price,
    currency: "MAD",
  };
  metaTrack("AddToCart", data, eventId);
  tiktokTrack("AddToCart", { value: opts.price, currency: "MAD", contents: [{ content_id: opts.productId, quantity: opts.offerQty }] }, eventId);
  return eventId;
}

export function trackInitiateCheckout(opts: {
  items: { productId: string; offerQty: number; price: number }[];
  total: number;
  eventId?: string;
}) {
  const eventId = opts.eventId ?? createEventId("InitiateCheckout");
  const data = {
    contents: opts.items.map((i) => ({ id: i.productId, quantity: i.offerQty, item_price: i.price })),
    value: opts.total,
    currency: "MAD",
    num_items: opts.items.length,
  };
  metaTrack("InitiateCheckout", data, eventId);
  tiktokTrack("InitiateCheckout", { value: opts.total, currency: "MAD" }, eventId);
  return eventId;
}

export function trackPurchase(opts: {
  items: { productId: string; offerQty: number; price: number }[];
  total: number;
  eventId: string;
}) {
  const data = {
    content_ids: opts.items.map((i) => i.productId),
    content_type: "product",
    contents: opts.items.map((i) => ({ id: i.productId, quantity: i.offerQty, item_price: i.price })),
    value: opts.total,
    currency: "MAD",
  };
  metaTrack("Purchase", data, opts.eventId);
  tiktokTrack("CompletePayment", { value: opts.total, currency: "MAD", contents: data.contents }, opts.eventId);
}
