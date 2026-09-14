"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";
import { Suspense } from "react";
import { useCartStore } from "@/lib/cart-store";

function AddToCartInline({ productId }: { productId: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const product = products.find((p) => p.id === productId);
  if (!product) return null;
  return (
    <button
      className="btn-primary text-sm py-3"
      onClick={() => {
        addItem(product);
        openDrawer();
      }}
    >
      أضف للسلة — 199 درهم ←
    </button>
  );
}

function ThankYouContent() {
  const params = useSearchParams();
  const name = params.get("name") || "زبيننا الكريم";
  const phone = params.get("phone") || "";
  const total = params.get("total") || "";
  const productNames = params.get("products") || "";
  const upsellId = params.get("upsell") || "";

  // Products NOT ordered by customer (for cross-sell section)
  const orderedProductNames = productNames.split("،").map((s) => s.trim());
  const crossSellProducts = products.filter(
    (p) => !orderedProductNames.includes(p.nameAr)
  );

  return (
    <div>
      {/* Hero Confirmation */}
      <section
        className="py-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-green) 0%, var(--brand-green-light) 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ background: "rgba(183,110,76,0.16)" }}
          >
            ✅
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            طلبك وصلنا يا {name}! 🎉
          </h1>
          <p className="text-lg mb-2" style={{ color: "var(--brand-gold)" }}>
            شكراً على ثقتك في صحتي
          </p>
          <p className="text-white/70 text-base mb-8">
            سيتصل بك فريقنا خلال دقائق لتأكيد الطلب وتنسيق التوصيل.
          </p>

          {/* Order details */}
          <div
            className="rounded-2xl p-5 text-right max-w-md mx-auto"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <h3
              className="font-bold text-sm mb-3 text-center"
              style={{ color: "var(--brand-gold)" }}
            >
              تفاصيل طلبك
            </h3>
            {productNames && (
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span className="leading-relaxed">{productNames}</span>
                <span className="text-white/50 mr-3 shrink-0">المنتجات</span>
              </div>
            )}
            {phone && (
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span dir="ltr">{phone}</span>
                <span className="text-white/50 mr-3">الهاتف</span>
              </div>
            )}
            {upsellId && (
              <div
                className="flex items-center gap-2 text-xs mt-2 mb-2 px-3 py-2 rounded-lg"
                style={{ background: "rgba(183,110,76,0.16)", color: "var(--brand-gold)" }}
              >
                <span>⭐</span>
                <span>تضمين عرض إضافي بـ 99 درهم</span>
              </div>
            )}
            {total && (
              <div className="flex justify-between text-sm font-bold border-t border-white/10 mt-3 pt-3">
                <span className="text-white">{total} درهم</span>
                <span className="text-white/50 mr-3">المجموع (عند الاستلام)</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What Happens Next — primes them to answer the confirmation call */}
      <section className="py-12 max-w-4xl mx-auto px-4">
        <h2
          className="text-2xl font-black text-center mb-8"
          style={{ color: "var(--brand-green)" }}
        >
          ماذا يحدث الآن؟
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: "📞",
              time: "خلال دقائق",
              title: "مكالمة التأكيد",
              desc: "سيتصل بك فريقنا لتأكيد طلبك. يُرجى الرد — المكالمة لا تتجاوز دقيقتين.",
              highlight: true,
            },
            {
              icon: "📦",
              time: "خلال 24-48 ساعة",
              title: "تحضير وشحن الطلب",
              desc: "بعد التأكيد، يُعبأ طلبك ويُسلّم لشركة الشحن. ستصلك رسالة برقم التتبع.",
              highlight: false,
            },
            {
              icon: "🤝",
              time: "عند الاستلام",
              title: "تسلّم وادفع",
              desc: `ادفع ${total ? total + " درهم" : "المبلغ"} نقداً فقط عند استلام الطرد. افحصه — ثم ادفع.`,
              highlight: false,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-5 border text-center"
              style={{
                borderColor: item.highlight ? "var(--brand-gold)" : "#e5e7eb",
                background: item.highlight ? "#fffbeb" : "white",
              }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block"
                style={{
                  background: item.highlight
                    ? "rgba(183,110,76,0.16)"
                    : "var(--brand-cream-dark)",
                  color: item.highlight ? "#92400e" : "var(--brand-green)",
                }}
              >
                {item.time}
              </span>
              <h3
                className="font-bold text-base mb-2 mt-2"
                style={{ color: "var(--brand-green)" }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Call-to-answer note — CRO for confirmation rate */}
        <div
          className="mt-6 rounded-2xl p-5 border-2"
          style={{ background: "#fffbeb", borderColor: "var(--brand-gold)" }}
        >
          <h3 className="font-bold text-base mb-2" style={{ color: "var(--brand-green)" }}>
            ⚠️ مهم — الرجاء القراءة
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            سنتصل بك قريباً لتأكيد طلبك وتحديد موعد التوصيل.{" "}
            <strong>يُرجى الرد على المكالمة</strong> حتى نتمكن من تأكيد طلبك
            وتحديد موعد التوصيل المناسب. في حال عدم الرد، سنحاول مرة أخرى. للاستفسار
            تواصل معنا عبر{" "}
            <Link href="/contact" className="font-bold underline" style={{ color: "var(--brand-green)" }}>
              صفحة الاتصال
            </Link>
            .
          </p>
        </div>

        {/* Trust strip */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: "💳", label: "دفع عند الاستلام", sub: "لا مخاطرة" },
            { icon: "🚚", label: "توصيل مجاني", sub: "لكل المغرب" },
            { icon: "🔄", label: "ضمان 30 يوم", sub: "بدون أسئلة" },
            { icon: "🌿", label: "طبيعي 100%", sub: "بدون كيمياء" },
          ].map((b) => (
            <div key={b.label} className="rounded-xl p-3 border border-gray-100 bg-white">
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="text-xs font-bold mb-0.5" style={{ color: "var(--brand-green)" }}>
                {b.label}
              </div>
              <div className="text-xs text-gray-400">{b.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social reinforcement */}
      <section className="py-10" style={{ background: "var(--brand-cream-dark)" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold mb-2" style={{ color: "var(--brand-green)" }}>
            أنت اخترت الأفضل 🌿
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            انضمت للـ 4,100+ مغربي الذين يثقون في صحتي لصحتهم الطبيعية.
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <span className="stars text-sm">★★★★★</span>
            <span className="stars text-sm">★★★★★</span>
            <span className="stars text-sm">★★★★★</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">4.8/5 من 4,100+ تقييم</p>
        </div>
      </section>

      {/* Cross-sell — products they didn't order, all at 199 MAD */}
      {crossSellProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-black mb-2"
              style={{ color: "var(--brand-green)" }}
            >
              أكمل صحتك — أضف لطلبك الحالي
            </h2>
            <p className="text-gray-500 text-sm">
              اطلب الآن وسيُوصّل معه في نفس الشحنة — 199 درهم لكل منتج
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {crossSellProducts.map((p) => (
              <div
                key={p.id}
                className="product-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${p.bgColor} 0%, white 100%)`,
                    height: "160px",
                  }}
                >
                  <span className="text-6xl">{p.emoji}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1" style={{ color: "var(--brand-green)" }}>
                    {p.nameAr}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">
                    {p.benefitsList[0]}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-black" style={{ color: "var(--brand-green)" }}>
                      199 درهم
                    </span>
                    <span className="stars text-xs">★★★★★</span>
                  </div>
                  <AddToCartInline productId={p.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: "var(--brand-cream-dark)", borderTopColor: "var(--brand-green)" }} />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
