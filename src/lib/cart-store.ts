"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

/** Bundle pricing: total qty → total price */
export function getBundleTotal(items: CartItem[]): number {
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  if (totalQty === 0) return 0;
  if (totalQty === 1) return 199;
  if (totalQty === 2) return 279;
  return 349; // 3+
}

/** Savings compared to full price (199 × qty) */
export function getBundleSavings(items: CartItem[]): number {
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const fullPrice = totalQty * 199;
  return Math.max(0, fullPrice - getBundleTotal(items));
}

/** Next bundle milestone nudge */
export function getNextBundleNudge(items: CartItem[]): { text: string; saving: number } | null {
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  if (totalQty === 1) return { text: "أضف منتجاً ثانياً ووفّر", saving: 199 * 2 - 279 };
  if (totalQty === 2) return { text: "أضف منتجاً ثالثاً ووفّر", saving: 199 * 3 - 349 };
  return null;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;

  // Upsell state — lives here so CheckoutModal + ThankYou can both read it
  upsellAccepted: boolean;
  upsellProduct: Product | null;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;

  setUpsellAccepted: (product: Product) => void;
  clearUpsell: () => void;

  getTotalQty: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      isCheckoutOpen: false,
      upsellAccepted: false,
      upsellProduct: null,

      addItem: (product: Product) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1 }] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isDrawerOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      setUpsellAccepted: (product: Product) =>
        set({ upsellAccepted: true, upsellProduct: product }),
      clearUpsell: () => set({ upsellAccepted: false, upsellProduct: null }),

      getTotalQty: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => getBundleTotal(get().items),
    }),
    { name: "sehti-cart" }
  )
);
