"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, getBundleTotal } from "@/lib/cart-store";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";
import { apiClient } from "@/lib/api-client";
import {
  createEventId,
  collectAttribution,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/tracking";

type Step = "form" | "upsell" | "submitting" | "error";

const UPSELL_SECONDS = 12;

/** Pick the single best upsell product based on cart contents */
function pickUpsellProduct(cartIds: string[]): Product | null {
  if (cartIds.length >= 3) return null;
  const priority = ["digestive-herbs", "oral-powder", "joint-blend"];
  for (const id of priority) {
    if (!cartIds.includes(id)) {
      return products.find((p) => p.id === id) ?? null;
    }
  }
  return null;
}

// Map frontend product IDs to backend product IDs
const PRODUCT_ID_MAP: Record<string, string> = {
  "oral-powder": "miswak-powder",
  "digestive-sachets": "digestive-herbs",
  "joint-blend": "turmeric-boswellia",
};

export default function CheckoutModal() {
  const router = useRouter();
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
    setUpsellAccepted,
    clearUpsell,
  } = useCartStore();

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [timeLeft, setTimeLeft] = useState(UPSELL_SECONDS);
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // State shared between form→upsell→complete
  const [orderToken, setOrderToken] = useState<string>("");
  const [purchaseEventId, setPurchaseEventId] = useState<string>("");
  const [subtotalMad, setSubtotalMad] = useState<number>(0);

  // Reset when modal closes
  useEffect(() => {
    if (!isCheckoutOpen) {
      setStep("form");
      setName("");
      setPhone("");
      setNameError("");
      setPhoneError("");
      setTimeLeft(UPSELL_SECONDS);
      setOrderToken("");
      setPurchaseEventId("");
      setSubtotalMad(0);
    }
  }, [isCheckoutOpen]);

  // Fire InitiateCheckout pixel when modal opens
  useEffect(() => {
    if (!isCheckoutOpen || items.length === 0) return;
    const total = getBundleTotal(items);
    trackInitiateCheckout({
      items: items.map((i) => ({
        productId: i.product.id,
        offerQty: i.quantity,
        price: total,
      })),
      total,
    });
  }, [isCheckoutOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const completeOrder = useCallback(
    async (acceptedUpsell: boolean, upsellItem: Product | null) => {
      setStep("submitting");
      clearUpsell();

      try {
        const order = await apiClient.completeOrder({
          order_token: orderToken,
          accepted_upsell: acceptedUpsell,
        });

        // Fire Purchase pixel (same event ID as what was sent to backend)
        trackPurchase({
          items: order.items.map((i) => ({
            productId: i.product_id,
            offerQty: i.offer_qty,
            price: i.price_mad,
          })),
          total: order.total_mad,
          eventId: purchaseEventId,
        });

        if (acceptedUpsell && upsellItem) {
          setUpsellAccepted(upsellItem);
        }

        const params = new URLSearchParams({
          name: order.customer_name,
          phone: order.phone,
          total: String(order.total_mad),
          order_number: String(order.order_number),
          products: order.items.map((i) => i.product_name_ar).join("،"),
          upsell: acceptedUpsell && upsellItem ? upsellItem.id : "",
        });

        clearCart();
        closeCheckout();
        router.push(`/thank-you?${params.toString()}`);
      } catch (err) {
        console.error("completeOrder error:", err);
        setStep("error");
        setErrorMessage(err instanceof Error ? err.message : "خطأ غير متوقع");
      }
    },
    [orderToken, purchaseEventId, clearCart, closeCheckout, clearUpsell, setUpsellAccepted, router]
  );

  // Upsell countdown
  useEffect(() => {
    if (step !== "upsell") return;
    if (timeLeft <= 0) {
      completeOrder(false, null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timeLeft, completeOrder]);

  if (!isCheckoutOpen) return null;

  const validate = () => {
    let valid = true;
    setNameError("");
    setPhoneError("");

    if (!name.trim() || name.trim().length < 2) {
      setNameError("الرجاء إدخال اسمك الكامل");
      valid = false;
    }
    const phoneClean = phone.replace(/\s/g, "");
    if (
      !phoneClean.startsWith("0") ||
      phoneClean.length !== 10 ||
      !/^\d+$/.test(phoneClean)
    ) {
      setPhoneError(
        "رقم غير صحيح — يجب أن يبدأ بـ 0 ويتكون من 10 أرقام (مثال: 0612345678)"
      );
      valid = false;
    }
    return valid;
  };

  const handleFormSubmit = async () => {
    if (!validate()) return;
    setStep("submitting");

    const attribution = collectAttribution();
    const eventId = createEventId("Purchase");
    setPurchaseEventId(eventId);

    const cartItems = items.map((i) => ({
      product_id: PRODUCT_ID_MAP[i.product.id] ?? i.product.id,
      offer_qty: i.quantity,
    }));

    try {
      const res = await apiClient.prepareOrder({
        customer_name: name.trim(),
        phone: phone.replace(/\s/g, ""),
        items: cartItems,
        event_id: eventId,
        fbp: attribution.fbp,
        fbc: attribution.fbc,
        ttp: attribution.ttp,
        ttclid: attribution.ttclid,
        page_url: typeof window !== "undefined" ? window.location.href : undefined,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      });

      setOrderToken(res.order_token);
      setSubtotalMad(res.subtotal_mad);

      // Show upsell if backend suggests one and it's not already in cart
      const cartProductFrontendIds = items.map((i) => i.product.id);
      const upsell = pickUpsellProduct(cartProductFrontendIds);

      if (upsell && res.upsell_product_id) {
        setUpsellProduct(upsell);
        setTimeLeft(UPSELL_SECONDS);
        setStep("upsell");
      } else {
        // No upsell available
        await completeOrder(false, null);
      }
    } catch (err) {
      console.error("prepareOrder error:", err);
      setStep("error");
      setErrorMessage(err instanceof Error ? err.message : "خطأ غير متوقع");
    }
  };

  const handleUpsellAccept = () => {
    if (!upsellProduct) return;
    completeOrder(true, upsellProduct);
  };

  const handleUpsellDecline = () => {
    completeOrder(false, null);
  };

  const total = getBundleTotal(items);
  const progressPct = ((UPSELL_SECONDS - timeLeft) / UPSELL_SECONDS) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && step === "form") closeCheckout();
      }}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg shadow-2xl"
        style={{ maxHeight: "95vh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* ─── FORM STEP ─── */}
        {step === "form" && (
          <div className="p-5 md:p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="text-xl font-black"
                  style={{ color: "var(--brand-green)" }}
                >
                  أكمل طلبك
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  الدفع عند الاستلام — مجاناً
                </p>
              </div>
              <button
                onClick={closeCheckout}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-xl"
              >
                ×
              </button>
            </div>

            {/* Order summary */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: "var(--brand-cream)" }}
            >
              <h3
                className="text-xs font-bold mb-3"
                style={{ color: "var(--brand-green)" }}
              >
                ملخص الطلب
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">
                      {item.product.emoji} {item.product.nameAr}
                      {item.quantity > 1 && (
                        <span className="text-gray-400 text-xs"> × {item.quantity}</span>
                      )}
                    </span>
                    <span className="font-bold" style={{ color: "var(--brand-green)" }}>
                      {item.product.price} درهم
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                  <span className="text-xs text-gray-400">التوصيل</span>
                  <span className="text-xs font-bold" style={{ color: "var(--brand-gold)" }}>مجاني 🎉</span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--brand-green)" }}
                  >
                    المجموع
                  </span>
                  <span
                    className="text-xl font-black"
                    style={{ color: "var(--brand-green)" }}
                  >
                    {total} درهم
                  </span>
                </div>
              </div>
            </div>

            {/* COD badge */}
            <div
              className="flex items-center gap-2 rounded-xl p-3 mb-5 text-sm font-medium"
              style={{ background: "var(--brand-cream-dark)", color: "var(--brand-green)" }}
            >
              <span>💳</span>
              <span>الدفع عند الاستلام — لا بطاقة الآن</span>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--brand-green)" }}
                >
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  className={`form-input ${nameError ? "error" : ""}`}
                  placeholder="مثال: أحمد بنعلي"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  autoComplete="name"
                />
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--brand-green)" }}
                >
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  className={`form-input ${phoneError ? "error" : ""}`}
                  placeholder="0612345678"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                />
                <p className="text-gray-400 text-xs mt-1">
                  مثال: 0612345678 — 10 أرقام تبدأ بـ 0
                </p>
                {phoneError && (
                  <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                )}
              </div>

              <button className="btn-gold cta-pulse mt-1" onClick={handleFormSubmit}>
                <span>تأكيد الطلب</span>
                <span>←</span>
              </button>

              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400 pt-1">
                {[
                  { icon: "🔒", text: "بياناتك آمنة" },
                  { icon: "🚚", text: "توصيل 24-48 ساعة" },
                  { icon: "🔄", text: "ضمان 30 يوم" },
                ].map((b) => (
                  <div key={b.text}>
                    <div className="text-base mb-1">{b.icon}</div>
                    <div>{b.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── UPSELL STEP ─── */}
        {step === "upsell" && upsellProduct && (
          <div className="p-5 md:p-7">
            {/* Countdown bar */}
            <div className="h-1.5 rounded-full bg-gray-100 mb-5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progressPct}%`,
                  background: "var(--brand-gold)",
                }}
              />
            </div>

            {/* Header */}
            <div
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ background: "rgba(183,110,76,0.14)", color: "var(--brand-clay)" }}
            >
              ⏱ عرض يختفي خلال {timeLeft} ثانية
            </div>

            <h2
              className="text-xl font-black mb-1"
              style={{ color: "var(--brand-green)" }}
            >
              لحظة قبل أن نُرسل طلبك...
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              عرض خاص لزبائننا الجدد فقط — لا يظهر في المتجر
            </p>

            {/* Upsell product card */}
            <div
              className="rounded-2xl border-2 p-5 mb-5"
              style={{
                borderColor: "var(--brand-gold)",
                background: upsellProduct.bgColor,
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{upsellProduct.emoji}</span>
                <div>
                  <p
                    className="font-black text-lg leading-tight"
                    style={{ color: "var(--brand-green)" }}
                  >
                    {upsellProduct.nameAr}
                  </p>
                  <p className="text-sm text-gray-500">{upsellProduct.tagline}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {upsellProduct.benefitsList[0]} — {upsellProduct.benefitsList[1]}
              </p>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-3xl font-black"
                  style={{ color: "var(--brand-green)" }}
                >
                  99 درهم
                </span>
                <span className="text-base text-gray-400 line-through">199 درهم</span>
                <span className="text-sm font-bold px-2 py-0.5 rounded-full text-white bg-red-500">
                  -50%
                </span>
              </div>

              <button
                className="btn-gold cta-pulse"
                onClick={handleUpsellAccept}
              >
                <span>أضف {upsellProduct.nameAr} بـ 99 درهم فقط</span>
                <span>←</span>
              </button>
            </div>

            {/* Decline */}
            <button
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
              onClick={handleUpsellDecline}
            >
              لا شكراً، أكمل طلبي بدون هذا المنتج
            </button>
          </div>
        )}

        {/* ─── SUBMITTING ─── */}
        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin"
              style={{
                borderColor: "var(--brand-cream-dark)",
                borderTopColor: "var(--brand-green)",
              }}
            />
            <p className="text-base font-medium" style={{ color: "var(--brand-green)" }}>
              جاري إرسال طلبك...
            </p>
          </div>
        )}

        {/* ─── ERROR ─── */}
        {step === "error" && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold mb-2">حدث خطأ</h3>
            <p className="text-gray-500 text-sm mb-6">
              {errorMessage || "لم نتمكن من إرسال طلبك. الرجاء المحاولة مرة أخرى."}
            </p>
            <button className="btn-primary" onClick={() => setStep("form")}>
              حاول مرة أخرى
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
