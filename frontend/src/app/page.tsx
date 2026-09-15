import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import TrustBar from "@/components/TrustBar";
import { products } from "@/lib/products";
import ImagePlaceholder from "@/components/ImagePlaceholder";

const reviews = [
  {
    name: "الحاج حسن",
    city: "فاس",
    product: "خليط الراحة",
    text: "جربت كل شيء لألم الظهر. 3 سنين أعاني. هذا المزيج غير حياتي من الأسبوع الثالث. كأنني ولدت من جديد.",
    rating: 5,
    emoji: "💪",
  },
  {
    name: "فاطمة ز.",
    city: "الدار البيضاء",
    product: "نقاء الهضم",
    text: "كانت بطني تنتفخ بعد كل أكلة وكنت كنحس بالثقل. دابا واضح الفرق من الأيام الأولى. كيس صغير غيرلي حياتي اليومية.",
    rating: 5,
    emoji: "🌿",
  },
  {
    name: "سعيد ب.",
    city: "أكادير",
    product: "أبيض المسواك",
    text: "كنت كنخاف نضحك في الصور ونغطي فمي بيدي. من بعد ما جربت هذا المسحوق، ثقتي رجعات والحساسية خفات بزاف.",
    rating: 5,
    emoji: "🦷",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <TrustBar />

      {/* 2. Hero Section: Text Right, Image Left */}
      <section className="relative overflow-hidden pt-12 pb-16 md:py-24" style={{ background: "var(--brand-cream)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text Right */}
            <div>
              <span
                className="inline-block text-sm font-bold px-4 py-2 rounded-full mb-6"
                style={{ background: "var(--brand-sage)", color: "var(--brand-green)" }}
              >
                🇲🇦 المتجر الطبيعي الأول في المغرب
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.2]" style={{ color: "var(--brand-green)" }}>
                صحتي: حلول طبيعية لمشاكل يومية كتأثر على راحتك وثقتك
              </h1>
              
              <p className="text-lg md:text-xl font-medium mb-10 leading-relaxed text-gray-700">
                مجموعة متنامية من الحلول الطبيعية المركزة لمشاكل يومية كتأثر على الراحة، الثقة، والحركة. 
                مكونات معروفة في ثقافتنا، شرح علمي بسيط، والدفع عند الاستلام.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-gray-900/10"
                  style={{ background: "var(--brand-green)", color: "white" }}
                >
                  تسوق المنتجات الآن
                </Link>
                <Link
                  href="#authority"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg border-2 transition-all hover:bg-white"
                  style={{ borderColor: "var(--brand-green)", color: "var(--brand-green)" }}
                >
                  تعرف على صحتي
                </Link>
              </div>

              {/* Bundle pricing strip */}
              <div
                className="inline-flex flex-wrap items-center justify-center gap-3 rounded-xl px-5 py-3 border border-gray-200 bg-white shadow-sm"
              >
                <span className="text-sm font-bold text-gray-500">عروض التوفير:</span>
                {[
                  { label: "1 منتج", price: "199 درهم" },
                  { label: "2 منتجات", price: "279 درهم" },
                  { label: "3 منتجات", price: "349 درهم" },
                ].map((t, i) => (
                  <span key={t.label} className="flex items-center gap-2 text-sm">
                    <span
                      className="font-black"
                      style={{ color: i === 2 ? "var(--brand-clay)" : "var(--brand-green)" }}
                    >
                      {t.price}
                    </span>
                    {i < 2 && <span className="text-gray-300">|</span>}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Image Left */}
            <div className="h-full min-h-[400px]">
              <ImagePlaceholder 
                productName="مجموعة منتجات صحتي" 
                text="صورة المنتجات أو نمط حياة يجمع الراحة والثقة" 
                emoji="✨" 
                bgColor="var(--brand-green-light)"
                color="var(--brand-gold)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem cards */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4" style={{ color: "var(--brand-green)" }}>
              لكل مشكلة يومية، حل طبيعي مركز
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🦷",
                title: "حساسية الأسنان وفقدان الثقة",
                desc: "كنشرب القهوة أو الماء البارد وكيضربني الألم. كنضحك ونغطي فمي بيدي.",
              },
              {
                emoji: "🌿",
                title: "الانتفاخ وثقل المعدة",
                desc: "بعد الماكلة كرشي كتنفخ، كنحس بالثقل والحريق، وكنبغي غير نحل الحزام.",
              },
              {
                emoji: "💪",
                title: "آلام المفاصل والظهر",
                desc: "كنفيق مع الصباح وظهري مشدود. كنوقف من الصلاة ولا الكرسي بصعوبة.",
              }
            ].map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center flex flex-col items-center">
                <div className="text-5xl mb-4 p-4 bg-white rounded-full shadow-sm">{p.emoji}</div>
                <h3 className="text-xl font-black mb-3" style={{ color: "var(--brand-clay)" }}>{p.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Sehti is different (Authority) */}
      <section id="authority" className="py-20" style={{ background: "var(--brand-green)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Right */}
            <div className="order-2 md:order-1 h-full min-h-[400px]">
              <ImagePlaceholder 
                productName="فلسفة صحتي" 
                text="صورة توضح المكونات الطبيعية والمصداقية" 
                emoji="🔬" 
                bgColor="var(--brand-green-light)"
                color="var(--brand-gold)"
              />
            </div>
            
            {/* Text Left */}
            <div className="order-1 md:order-2">
              <span className="inline-block text-sm font-bold px-3 py-1 rounded-full mb-4 bg-white/20 text-white">
                لماذا نحن مختلفون؟
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                ما كنبيعوش منتجات عامة.
              </h2>
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-8">
                كل تركيبة في صحتي معمولة لمشكل واحد فقط. اخترنا مكونات معروفة في ثقافتنا، شرحناها بالعلم، وضمنّاها بتجربة بدون مخاطرة.
              </p>
              
              <ul className="space-y-5">
                {[
                  { title: "مكونات مختارة لسبب", desc: "كل عنصر عنده دور واضح ومثبت، ماشي غير خلطة عشوائية." },
                  { title: "علم وتراث", desc: "نجمع بين حكمة الجدات والدراسات العلمية الحديثة (PubMed و WHO)." },
                  { title: "شفافية وضمان", desc: "إلى ما نفعتكش النتيجة، كنرجعو لك فلوسك. بدون تعقيدات." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shrink-0 mt-1" style={{ background: "var(--brand-gold)", color: "var(--brand-green)" }}>
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-white/70 font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured products */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "var(--brand-green)" }}>
              منتجاتنا
            </h2>
            <p className="text-gray-500 text-lg font-medium">حلول طبيعية مركزة، وكل تركيبة معمولة لمشكل واضح.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} showBadge />
            ))}
          </div>
        </div>
      </section>

      {/* 7. UGC / Social proof */}
      <section className="py-20" style={{ background: "var(--brand-cream)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "var(--brand-green)" }}>
              تجارب حقيقية من زبائننا المغاربة
            </h2>
            <p className="text-gray-600 text-lg font-medium">مشي صور مثالية ولا كلام مبالغ فيه. فقط تجارب غيرت حياتهم اليومية.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Video placeholders */}
            {[
              { text: "فيديو مسواك - ثقة الابتسامة", emoji: "🎥", bg: "var(--brand-cream)" },
              { text: "فيديو الهضم - راحة ما بعد الغداء", emoji: "🎥", bg: "var(--brand-cream-dark)" },
              { text: "فيديو المفاصل - سهولة الحركة", emoji: "🎥", bg: "var(--brand-sage)" }
            ].map((v, i) => (
              <div key={i} className="h-72 rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
                <ImagePlaceholder 
                  productName="" 
                  text={v.text} 
                  emoji={v.emoji} 
                  bgColor={v.bg}
                  color="var(--brand-green)"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/60 transition-all">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl bg-gray-50 p-2 rounded-2xl">{r.emoji}</div>
                  <div>
                    <div className="font-black text-lg" style={{ color: "var(--brand-green)" }}>{r.name}</div>
                    <div className="text-sm font-bold text-gray-400">{r.city}</div>
                  </div>
                  <span className="mr-auto text-xs px-2 py-1 rounded-full font-bold" style={{ background: "var(--brand-sage)", color: "var(--brand-green)" }}>
                    {r.product}
                  </span>
                </div>
                <div className="stars text-xl mb-3">{"★".repeat(r.rating)}</div>
                <p className="text-gray-700 text-base leading-relaxed font-medium">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. COD Reassurance */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-10" style={{ color: "var(--brand-green)" }}>
            طلبك بلا مخاطرة. كيفاش كنخدمو؟
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-12 right-[15%] left-[15%] h-1 border-t-2 border-dashed border-gray-200 z-0"></div>
            
            {[
              { step: "1", title: "املأ الاسم ورقم الهاتف", desc: "بدون بطاقة بنكية، فقط معلوماتك الأساسية في صفحة الدفع." },
              { step: "2", title: "نتصل بك لتأكيد الطلب", desc: "سيقوم فريقنا بالتواصل معك لتأكيد طلبك والإجابة عن أي استفسار قبل الشحن." },
              { step: "3", title: "تستلم وتدفع عند الباب", desc: "تصلك الطلبية، تفحص الطرد ديالك، عاد تخلص الموزع." }
            ].map((item) => (
              <div key={item.step} className="relative z-10 bg-white pt-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-md" style={{ background: "var(--brand-gold)", color: "var(--brand-green)" }}>
                  {item.step}
                </div>
                <h3 className="text-xl font-black mb-3" style={{ color: "var(--brand-green)" }}>{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 text-center" style={{ background: "var(--brand-green)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            اختر المنتج المناسب لك الآن
          </h2>
          <p className="text-white/80 text-lg md:text-xl font-medium mb-10">
            صحتك تستحق أن تستثمر فيها بمنتجات طبيعية ومضمونة.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl"
            style={{ background: "var(--brand-gold)", color: "var(--brand-green)" }}
          >
            تصفح المنتجات ←
          </Link>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-bold text-white/70">
            <span className="flex items-center gap-2">🚚 توصيل مجاني</span>
            <span className="flex items-center gap-2">🛡️ ضمان 30 يوم</span>
          </div>
        </div>
      </section>
    </div>
  );
}