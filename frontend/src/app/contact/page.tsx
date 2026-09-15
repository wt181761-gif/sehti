import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا — صحتي",
  description: "تواصل مع فريق صحتي لأي استفسار حول طلبك أو منتجاتنا.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <span className="text-5xl mb-4 block">💬</span>
        <h1
          className="text-3xl font-black mb-2"
          style={{ color: "var(--brand-green)" }}
        >
          تواصل معنا
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          فريقنا متاح للإجابة على جميع استفساراتك من الاثنين إلى الجمعة،
          9 صباحاً — 6 مساءً.
        </p>
      </div>

      {/* Contact options */}
      <div className="space-y-4 mb-10">
        <a
          href="mailto:support@sehti.ma"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-300 transition-colors group"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: "var(--brand-cream-dark)" }}
          >
            📧
          </div>
          <div>
            <div
              className="font-bold text-sm mb-0.5"
              style={{ color: "var(--brand-green)" }}
            >
              البريد الإلكتروني
            </div>
            <div className="text-sm text-gray-500">support@sehti.ma</div>
            <div className="text-xs text-gray-400 mt-1">
              نجيب خلال 24 ساعة عمل
            </div>
          </div>
        </a>

        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: "var(--brand-cream-dark)" }}
          >
            🕐
          </div>
          <div>
            <div
              className="font-bold text-sm mb-0.5"
              style={{ color: "var(--brand-green)" }}
            >
              ساعات العمل
            </div>
            <div className="text-sm text-gray-500">
              الاثنين — الجمعة: 9:00 ص — 6:00 م
            </div>
            <div className="text-sm text-gray-500">السبت: 10:00 ص — 2:00 م</div>
          </div>
        </div>
      </div>

      {/* FAQ quick links */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--brand-cream-dark)" }}
      >
        <h2
          className="font-bold text-base mb-4"
          style={{ color: "var(--brand-green)" }}
        >
          أسئلة شائعة
        </h2>
        <ul className="space-y-3">
          {[
            {
              q: "كم يستغرق التوصيل؟",
              a: "24-48 ساعة لجميع مدن المغرب الكبرى. المناطق النائية قد تصل لـ 72 ساعة.",
            },
            {
              q: "كيف أتتبع شحنتي؟",
              a: "ستتلقى رقم التتبع عبر البريد الإلكتروني بعد تأكيد الطلب.",
            },
            {
              q: "ماذا لو أردت إرجاع المنتج؟",
              a: "ضمان الرضا 30 يوماً. تواصل معنا وسنرتب الاسترداد كاملاً.",
            },
            {
              q: "هل يمكنني تغيير طلبي بعد إرساله؟",
              a: "نعم، إذا تواصلت معنا قبل الشحن. بعد الشحن لا يمكن تعديله.",
            },
          ].map((faq, i) => (
            <li key={i} className="text-sm">
              <span className="font-bold" style={{ color: "var(--brand-green)" }}>
                {faq.q}
              </span>
              <br />
              <span className="text-gray-500">{faq.a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
