"use client";

import { useEffect } from "react";
import { useCartStore, getBundleTotal, getBundleSavings, getNextBundleNudge } from "@/lib/cart-store";
import { products } from "@/lib/products";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    openCheckout,
  } = useCartStore();

  const total = getBundleTotal(items);
  const savings = getBundleSavings(items);
  const nudge = getNextBundleNudge(items);
  const cartIds = items.map((i) => i.product.id);
  const crossSells = products.filter((p) => !cartIds.includes(p.id)).slice(0, 2);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 modal-backdrop transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "min(420px, 100vw)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="font-black text-lg" style={{ color: "var(--brand-green)" }}>
              سلة التسوق
            </h2>
            {items.length > 0 && (
              <span
                className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-white"
                style={{ background: "var(--brand-gold)", color: "var(--brand-green)" }}
              >
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <span className="text-5xl mb-4">🛒</span>
              <p className="font-bold text-base mb-2" style={{ color: "var(--brand-green)" }}>
                سلتك فارغة
              </p>
              <p className="text-sm text-gray-400 mb-6">
                اختر منتجاً لبدء طلبك
              </p>
              <button
                onClick={closeDrawer}
                className="btn-primary"
                style={{ maxWidth: "220px" }}
              >
                تسوق الآن ←
              </button>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {/* Bundle pricing banner */}
              {savings > 0 && (
                <div
                  className="rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-bold"
                  style={{ background: "#f0fdf4", color: "#166534" }}
                >
                  <span>🎉</span>
                  <span>توفير {savings} درهم بالباقة</span>
                </div>
              )}

              {/* Nudge to next bundle tier */}
              {nudge && (
                <div
                  className="rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium"
                  style={{ background: "#fffbeb", color: "#92400e" }}
                >
                  <span>💡</span>
                  <span>{nudge.text} {nudge.saving} درهم إضافية</span>
                </div>
              )}

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3"
                >
                  {/* Image */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                    style={{ background: item.product.bgColor }}
                  >
                    {item.product.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-sm leading-tight mb-1 truncate"
                      style={{ color: "var(--brand-green)" }}
                    >
                      {item.product.nameAr}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">{item.product.tagline}</p>
                    {/* Qty */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 bg-white rounded-lg overflow-hidden">
                        <button
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-base font-bold"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-base font-bold"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        onClick={() => removeItem(item.product.id)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <div
                      className="font-black text-base"
                      style={{ color: "var(--brand-green)" }}
                    >
                      199 درهم
                    </div>
                  </div>
                </div>
              ))}

              {/* Cross-sells */}
              {crossSells.length > 0 && (
                <div>
                  <p
                    className="text-xs font-bold mb-3 mt-2"
                    style={{ color: "var(--brand-muted)" }}
                  >
                    أضف لطلبك ووفّر أكثر
                  </p>
                  <div className="space-y-2">
                    {crossSells.map((p) => (
                      <CrossSellRow key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer — sticky checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-gray-400">المجموع</div>
                <div
                  className="text-2xl font-black"
                  style={{ color: "var(--brand-green)" }}
                >
                  {total} درهم
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold" style={{ color: "var(--brand-gold)" }}>توصيل مجاني 🚚</div>
                <div className="text-xs text-gray-400">دفع عند الاستلام</div>
              </div>
            </div>

            <button
              className="btn-gold cta-pulse"
              onClick={() => {
                closeDrawer();
                openCheckout();
              }}
            >
              <span>أتمم الطلب الآن</span>
              <span>←</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Inline mini cross-sell card
function CrossSellRow({ product }: { product: import("@/lib/products").Product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
        style={{ background: product.bgColor }}
      >
        {product.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-bold text-xs leading-tight truncate mb-0.5"
          style={{ color: "var(--brand-green)" }}
        >
          {product.nameAr}
        </p>
        <p className="text-xs text-gray-400">{product.price} درهم</p>
      </div>
      <button
        className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition-all"
        style={{
          borderColor: "var(--brand-green)",
          color: "var(--brand-green)",
        }}
        onClick={() => addItem(product)}
      >
        أضف +
      </button>
    </div>
  );
}
