/**
 * API client for صحتي backend.
 * All calls go through here — nothing should fetch() the backend directly.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export interface CartItemPayload {
  product_id: string;
  offer_qty: number;
}

export interface PrepareOrderPayload {
  customer_name: string;
  phone: string;
  items: CartItemPayload[];
  event_id: string;
  fbp?: string | null;
  fbc?: string | null;
  ttp?: string | null;
  ttclid?: string | null;
  page_url?: string;
  user_agent?: string;
}

export interface PrepareOrderResponse {
  order_token: string;
  subtotal_mad: number;
  upsell_product_id: string | null;
  upsell_price_mad: number;
  expires_in_seconds: number;
}

export interface CompleteOrderPayload {
  order_token: string;
  accepted_upsell: boolean;
}

export interface OrderItemResponse {
  product_id: string;
  product_name_ar: string;
  item_type: string;
  offer_qty: number;
  price_mad: number;
}

export interface CompleteOrderResponse {
  order_id: string;
  order_number: number;
  customer_name: string;
  phone: string;
  items: OrderItemResponse[];
  subtotal_mad: number;
  upsell_total_mad: number;
  total_mad: number;
  currency: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      detail = json?.detail ?? detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  prepareOrder(payload: PrepareOrderPayload): Promise<PrepareOrderResponse> {
    return post("/api/orders/prepare", payload);
  },

  completeOrder(payload: CompleteOrderPayload): Promise<CompleteOrderResponse> {
    return post("/api/orders/complete", payload);
  },
};
