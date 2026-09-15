import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--brand-green)", color: "white" }} className="mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <div>
                <div className="text-xl font-black">صحتي</div>
                <div className="text-sm opacity-70">صحتك، طبيعية</div>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              صحتي هي متجر المغرب الأول للصحة الطبيعية. منتجات طبيعية 100%
              لمشاكل حقيقية. الدفع عند الاستلام في جميع أنحاء المغرب.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(183,110,76,0.16)", color: "var(--brand-gold)" }}
              >
                ✓ دفع عند الاستلام
              </span>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(183,110,76,0.16)", color: "var(--brand-gold)" }}
              >
                ✓ شحن مجاني
              </span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-base mb-4" style={{ color: "var(--brand-gold)" }}>
              منتجاتنا
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/products/abyad-almeswak" className="hover:opacity-100 transition-opacity">
                  أبيض المسواك — مسحوق الأسنان الطبيعي
                </Link>
              </li>
              <li>
                <Link href="/products/naqaa-alhadm" className="hover:opacity-100 transition-opacity">
                  نقاء الهضم — كيس ما بعد الأكل
                </Link>
              </li>
              <li>
                <Link href="/products/khalt-alraha" className="hover:opacity-100 transition-opacity">
                  خليط الراحة — مزيج المفاصل والظهر
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:opacity-100 transition-opacity">
                  جميع المنتجات →
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-base mb-4" style={{ color: "var(--brand-gold)" }}>
              معلومات مهمة
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/policies/shipping" className="hover:opacity-100 transition-opacity">
                  سياسة الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:opacity-100 transition-opacity">
                  سياسة الإرجاع
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:opacity-100 transition-opacity">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:opacity-100 transition-opacity">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition-opacity">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            {[
              { icon: "🌿", text: "طبيعي 100%" },
              { icon: "🚚", text: "شحن مجاني لكل المغرب" },
              { icon: "💳", text: "الدفع عند الاستلام" },
              { icon: "🔄", text: "ضمان الرضا 30 يوم" },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1 opacity-80">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs opacity-50">
          <span>© {new Date().getFullYear()} صحتي — جميع الحقوق محفوظة</span>
          <span>المغرب 🇲🇦</span>
        </div>
      </div>
    </footer>
  );
}
