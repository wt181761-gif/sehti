import TrustBar from "@/components/TrustBar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "منتجاتنا — صحتي",
  description:
    "اكتشف منتجات صحتي الطبيعية: مسحوق الأسنان، خليط الهضم، ومزيج المفاصل. الدفع عند الاستلام.",
};

export default function CollectionsPage() {
  return (
    <div>
      <TrustBar />

      {/* Hero */}
      <section
        className="py-12 text-center"
        style={{ background: "var(--brand-cream-dark)" }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <h1
            className="text-4xl font-black mb-3"
            style={{ color: "var(--brand-green)" }}
          >
            منتجاتنا الطبيعية
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            اختيارات طبيعية مركزة لمشاكل صحية يومية. كل منتج في صحتي معمول
            لمشكل واضح — لأن جسمك يستحق حلاً دقيقاً ومفهوماً.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <span className="trust-badge">✓ طبيعي 100%</span>
            <span className="trust-badge">✓ دفع عند الاستلام</span>
            <span className="trust-badge">✓ شحن مجاني</span>
            <span className="trust-badge">✓ ضمان 30 يوم</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} showBadge />
          ))}
        </div>

        {/* Bundle pricing table */}
        <div
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: "var(--brand-green)", color: "white" }}
        >
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(183,110,76,0.16)", color: "var(--brand-gold)" }}
          >
            💡 كلما أضفت أكثر — دفعت أقل
          </span>
          <h2 className="text-2xl font-black mb-6">أسعار الباقات</h2>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
            {[
              { qty: "1 منتج", price: "199 درهم", saving: null, highlight: false },
              { qty: "2 منتجات", price: "279 درهم", saving: "وفّر 119", highlight: false },
              { qty: "3 منتجات", price: "349 درهم", saving: "وفّر 248", highlight: true },
            ].map((tier) => (
              <div
                key={tier.qty}
                className="rounded-xl p-4"
                style={{
                  background: tier.highlight
                    ? "rgba(183,110,76,0.16)"
                    : "rgba(255,255,255,0.08)",
                  border: tier.highlight ? "1px solid rgba(183,110,76,0.45)" : "none",
                }}
              >
                <div className="text-xs text-white/60 mb-1">{tier.qty}</div>
                <div
                  className="text-lg font-black"
                  style={{ color: tier.highlight ? "var(--brand-gold)" : "white" }}
                >
                  {tier.price}
                </div>
                {tier.saving && (
                  <div className="text-xs text-white/70 mt-1">{tier.saving}</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-white/50 text-xs">
            الخصم يُحسب تلقائياً في السلة عند إضافة أكثر من منتج
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-12"
        style={{ background: "var(--brand-cream-dark)" }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <h2
            className="text-2xl font-black text-center mb-8"
            style={{ color: "var(--brand-green)" }}
          >
            أسئلة شائعة
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "كيف يتم التوصيل؟",
                a: "نُوصّل لجميع مدن المغرب خلال 24-48 ساعة عبر شركات شحن موثوقة. التوصيل مجاني دون أي شروط.",
              },
              {
                q: "هل يمكنني إرجاع المنتج؟",
                a: "نعم، ضمان الرضا الكامل 30 يوماً. إذا لم تكن راضياً لأي سبب، نُعيد لك المبلغ كاملاً.",
              },
              {
                q: "هل المنتجات آمنة؟",
                a: "جميع مكوناتنا طبيعية 100% بدون مواد حافظة كيميائية أو سكر مضاف. للحالات الصحية الخاصة، استشر طبيبك.",
              },
              {
                q: "هل يمكنني طلب أكثر من منتج؟",
                a: "بالطبع. أضف ما تريد للسلة وأكمل طلباً واحداً — كل شيء يُوصّل في نفس الشحنة.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100"
              >
                <h3
                  className="font-bold text-sm mb-2"
                  style={{ color: "var(--brand-green)" }}
                >
                  {faq.q}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
