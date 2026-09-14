import { notFound } from "next/navigation";
import type { Metadata } from "next";

const policies: Record<
  string,
  { title: string; content: React.ReactNode }
> = {
  shipping: {
    title: "سياسة الشحن والتوصيل",
    content: (
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold mb-2">التوصيل المجاني</h2>
          <p>
            نُوفّر التوصيل المجاني لجميع طلبات صحتي لجميع أنحاء المغرب، دون
            أي حد أدنى للطلب.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">مدة التوصيل</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>الدار البيضاء، الرباط، مراكش، طنجة، فاس، أكادير: 24-48 ساعة</li>
            <li>باقي المدن الكبرى: 48-72 ساعة</li>
            <li>المناطق النائية: 72-96 ساعة</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">الدفع عند الاستلام</h2>
          <p>
            جميع الطلبات تُدفع نقداً عند استلام الشحنة. لا حاجة لأي بطاقة
            بنكية أو دفع مسبق. يمكنك فحص المنتج قبل الدفع.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">التتبع</h2>
          <p>
            بعد تأكيد الطلب وشحنه، ستتلقى رقم تتبع للشحنة. يمكنك تتبع
            شحنتك مباشرة على موقع شركة الشحن.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">الشحنات الفاشلة</h2>
          <p>
            إذا لم نتمكن من التوصيل بعد 3 محاولات، سنتواصل معك لترتيب موعد
            بديل. يُرجى التأكد من صحة رقم الهاتف والعنوان.
          </p>
        </section>
      </div>
    ),
  },
  returns: {
    title: "سياسة الإرجاع والاسترداد",
    content: (
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold mb-2">ضمان الرضا 30 يوماً</h2>
          <p>
            نضمن رضاك الكامل. إذا لم تكن راضياً عن منتجك لأي سبب خلال 30 يوماً
            من الاستلام، يمكنك طلب الاسترداد الكامل.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">شروط الإرجاع</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>خلال 30 يوماً من تاريخ الاستلام</li>
            <li>يجب أن يكون المنتج في عبوته الأصلية</li>
            <li>استُخدم أقل من 30% من المنتج (للحالات التي تطلب الاسترداد بسبب عدم الرضا)</li>
            <li>للمنتجات التالفة أو الخاطئة: إرجاع كامل بغض النظر عن كمية الاستخدام</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">كيفية طلب الإرجاع</h2>
          <p>
            تواصل معنا عبر صفحة الاتصال مع ذكر رقم طلبك وسبب الإرجاع. سنتواصل
            معك خلال 24 ساعة لترتيب استلام المنتج.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">الاسترداد</h2>
          <p>
            بعد استلام المنتج المُرجَع، يُعالج الاسترداد خلال 5-7 أيام عمل عبر
            تحويل بنكي أو الطريقة التي تفضلها.
          </p>
        </section>
      </div>
    ),
  },
  privacy: {
    title: "سياسة الخصوصية",
    content: (
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold mb-2">المعلومات التي نجمعها</h2>
          <p>
            نجمع فقط المعلومات الضرورية لمعالجة طلبك: الاسم ورقم الهاتف.
            لا نطلب عنوانك إلا عند الشحن المباشر، ولا نجمع أي معلومات
            مالية.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">كيف نستخدم معلوماتك</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>تأكيد طلبك والتواصل معك بشأنه</li>
            <li>التنسيق مع شركة الشحن للتوصيل</li>
            <li>الرد على استفساراتك</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">لا نشارك بياناتك</h2>
          <p>
            لا نبيع أو نشارك معلوماتك الشخصية مع أي طرف ثالث لأغراض تسويقية.
            المعلومات تُشارك فقط مع شركة الشحن لإتمام التوصيل.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">حقك في البيانات</h2>
          <p>
            يمكنك طلب حذف بياناتك في أي وقت بالتواصل معنا عبر صفحة الاتصال.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">الكوكيز</h2>
          <p>
            نستخدم كوكيز محدودة لتذكر سلة التسوق وتحسين تجربتك. لا نستخدم
            كوكيز تتبعية لأغراض إعلانية.
          </p>
        </section>
      </div>
    ),
  },
  terms: {
    title: "الشروط والأحكام",
    content: (
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold mb-2">قبول الشروط</h2>
          <p>
            باستخدامك لموقع صحتي أو إتمامك طلباً، فإنك توافق على هذه الشروط
            والأحكام.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">المنتجات</h2>
          <p>
            منتجات صحتي مكملات غذائية طبيعية. لا تُعدّ هذه المنتجات أدوية
            ولا تستبدل الاستشارة الطبية. استشر طبيبك إذا كنت تعاني من حالة
            صحية مزمنة أو تتناول أدوية.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">الطلبات والأسعار</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>الأسعار المعروضة بالدرهم المغربي شاملة الضريبة</li>
            <li>نحتفظ بالحق في تغيير الأسعار دون إشعار مسبق</li>
            <li>يُعتبر الطلب مؤكداً بعد مكالمة التأكيد من فريقنا</li>
            <li>نحتفظ بالحق في رفض الطلبات في حالات استثنائية</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">المسؤولية</h2>
          <p>
            النتائج تتفاوت من شخص لآخر. لا نضمن نتائج محددة لكل مستخدم.
            الضمان المقدم هو ضمان رضا المستخدم (استرداد المبلغ) وليس ضماناً
            لنتيجة طبية محددة.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold mb-2">القانون الواجب التطبيق</h2>
          <p>
            تخضع هذه الشروط للقانون المغربي. أي نزاع يُحل أمام المحاكم
            المختصة في المغرب.
          </p>
        </section>
      </div>
    ),
  },
};

interface Props {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const policy = policies[type];
  if (!policy) return { title: "الصفحة غير موجودة" };
  return { title: `${policy.title} — صحتي` };
}

export function generateStaticParams() {
  return Object.keys(policies).map((type) => ({ type }));
}

export default async function PolicyPage({ params }: Props) {
  const { type } = await params;
  const policy = policies[type];
  if (!policy) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div
        className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
        style={{
          background: "var(--brand-cream-dark)",
          color: "var(--brand-green)",
        }}
      >
        سياسات صحتي
      </div>
      <h1
        className="text-3xl font-black mb-8"
        style={{ color: "var(--brand-green)" }}
      >
        {policy.title}
      </h1>

      <div className="prose prose-sm text-gray-600 leading-relaxed max-w-none">
        {policy.content}
      </div>

      <div
        className="mt-12 rounded-2xl p-5 text-center"
        style={{ background: "var(--brand-cream-dark)" }}
      >
        <p className="text-sm text-gray-500 mb-3">هل لديك أسئلة؟</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 font-bold text-sm"
          style={{ color: "var(--brand-green)" }}
        >
          تواصل مع فريقنا ←
        </a>
      </div>
    </div>
  );
}
