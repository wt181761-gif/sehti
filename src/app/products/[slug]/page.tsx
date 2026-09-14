import { notFound } from "next/navigation";
import { products, getProductBySlug, getCrossSells } from "@/lib/products";
import type { Metadata } from "next";
import TrustBar from "@/components/TrustBar";
import CrossSells from "@/components/CrossSells";
import AddToCartButton from "@/components/AddToCartButton";
import ImagePlaceholder from "@/components/ImagePlaceholder";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "المنتج غير موجود" };
  return {
    title: `${product.nameAr} — صحتي`,
    description: product.description,
  };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const crossSells = getCrossSells(product.id);

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div>
      <TrustBar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
        <a href="/" className="hover:underline">الرئيسية</a>
        <span>/</span>
        <a href="/collections" className="hover:underline">المنتجات</a>
        <span>/</span>
        <span style={{ color: "var(--brand-green)" }}>{product.nameAr}</span>
      </div>

      {/* 1. Product Hero: Text Right, Image Left */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Right (Col 1 in RTL) */}
          <div>
            <span
              className="inline-block text-xs font-bold px-4 py-2 rounded-full mb-6"
              style={{
                background: `var(--brand-sage)`,
                color: 'var(--brand-green)',
              }}
            >
              {product.tagline}
            </span>

            <h1
              className="text-4xl md:text-5xl font-black mb-4 leading-tight"
              style={{ color: "var(--brand-green)" }}
            >
              {product.nameAr}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="stars text-lg">★★★★★</span>
              <span className="text-sm font-bold text-gray-500 underline decoration-gray-300">
                ({product.reviews.length * 42 + 137} تقييم من زبائننا)
              </span>
            </div>

            <p
              className="text-lg md:text-xl leading-relaxed mb-8 font-bold"
              style={{ color: "var(--brand-clay)" }}
            >
              {product.heroHook}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black" style={{ color: "var(--brand-green)" }}>
                {product.price} درهم
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {product.oldPrice} درهم
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-sm font-bold px-3 py-1 rounded-full text-white bg-red-500">
                  وفّر {discountPercent}%
                </span>
              )}
            </div>

            <AddToCartButton product={product} />

            <div className="mt-6 flex flex-col gap-3">
              <div
                className="flex items-center gap-3 rounded-2xl p-4 text-sm font-bold"
                style={{ background: "rgba(200, 162, 74, 0.1)", color: "var(--brand-green)" }}
              >
                <span className="text-xl">💳</span>
                <span>الدفع عند الاستلام — لا تحتاج بطاقة بنكية للطلب</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold" style={{ color: "var(--brand-green)" }}>
                <div className="rounded-xl p-3 bg-white border border-gray-100 shadow-sm flex flex-col items-center gap-1">
                  <span className="text-xl">🚚</span> توصيل مجاني
                </div>
                <div className="rounded-xl p-3 bg-white border border-gray-100 shadow-sm flex flex-col items-center gap-1">
                  <span className="text-xl">🛡️</span> ضمان 30 يوم
                </div>
                <div className="rounded-xl p-3 bg-white border border-gray-100 shadow-sm flex flex-col items-center gap-1">
                  <span className="text-xl">🌿</span> طبيعي 100%
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Left (Col 2 in RTL) */}
          <div className="h-full">
            <ImagePlaceholder 
              productName={product.nameAr} 
              emoji={product.emoji} 
              bgColor={product.bgColor}
              color={product.color}
            />
          </div>
        </div>
      </section>

      {/* 2. Problem Mirror: Image Right, Text Left */}
      <section className="py-16 md:py-24" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Right (Col 1 in RTL) */}
            <div className="order-2 md:order-1 h-full">
              <ImagePlaceholder 
                productName="المشكلة والحل" 
                text="صورة توضح المعاناة اليومية" 
                emoji="😟" 
                bgColor="var(--brand-sage)"
                color="var(--brand-green)"
              />
            </div>
            
            {/* Text Left (Col 2 in RTL) */}
            <div className="order-1 md:order-2">
              <h2
                className="text-3xl md:text-4xl font-black mb-6 leading-tight"
                style={{ color: "var(--brand-green)" }}
              >
                هل تعاني من هذا يومياً؟
              </h2>
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed text-lg mb-6 p-6 rounded-2xl border-r-4 border-red-400 bg-red-50/30 font-medium">
                  {product.agitation}
                </p>
                <p className="text-gray-600 leading-relaxed text-lg p-6 rounded-2xl border-r-4 font-medium" style={{ background: "var(--brand-cream)", borderColor: "var(--brand-green)" }}>
                  {product.solution}
                </p>
              </div>
              
              <h3 className="font-black text-xl mb-4" style={{ color: "var(--brand-clay)" }}>كيف سيغير هذا المنتج يومك:</h3>
              <ul className="space-y-4">
                {product.benefitsList.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-gray-700 font-bold bg-gray-50 p-4 rounded-xl">
                    <span className="mt-0.5 text-xl" style={{ color: "var(--brand-gold)" }}>✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ingredients: Text Right, Image Left */}
      <section className="py-16 md:py-24" style={{ background: "var(--brand-cream)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Right (Col 1 in RTL) */}
            <div>
              <span className="inline-block text-sm font-bold mb-3 px-3 py-1 rounded-full" style={{ background: "var(--brand-sage)", color: "var(--brand-green)" }}>
                السر في التركيبة
              </span>
              <h2
                className="text-3xl md:text-4xl font-black mb-4 leading-tight"
                style={{ color: "var(--brand-green)" }}
              >
                مكونات من الطبيعة، ومثبتة علمياً
              </h2>
              <p className="text-gray-600 text-lg mb-8 font-medium">
                ما كنبيعوش منتجات عامة. كل تركيبة في صحتي معمولة لمشكل واحد، بمكونات معروفة، مفهومة، ومختارة على أساس الفائدة ديالها.
              </p>
              
              <div className="space-y-4">
                {product.ingredients.map((ing, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl bg-gray-50 p-3 rounded-2xl">{ing.emoji}</span>
                      <div>
                        <h3
                          className="font-black text-lg mb-1"
                          style={{ color: "var(--brand-green)" }}
                        >
                          {ing.name}
                        </h3>
                        <p className="text-base text-gray-700 mb-3 font-bold">{ing.benefit}</p>
                        <p
                          className="text-xs font-bold px-3 py-1.5 rounded-lg inline-block border"
                          style={{
                            background: "var(--brand-cream)",
                            color: "var(--brand-clay)",
                            borderColor: "var(--brand-gold)"
                          }}
                        >
                          🔬 الدليل: {ing.science}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Left (Col 2 in RTL) */}
            <div className="h-full">
              <ImagePlaceholder 
                productName="المكونات الطبيعية" 
                text="صورة تبرز مكونات التركيبة" 
                emoji="🌿" 
                bgColor="white"
                color="var(--brand-green)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. How To Use: Image Right, Text Left */}
      <section className="py-16 md:py-24" style={{ background: "var(--brand-green)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Right (Col 1 in RTL) */}
            <div className="order-2 md:order-1 h-full">
              <ImagePlaceholder 
                productName="طريقة الاستخدام" 
                text="صورة توضح خطوة الاستخدام" 
                emoji="⏱️" 
                bgColor="var(--brand-green-light)"
                color="var(--brand-gold)"
              />
            </div>

            {/* Text Left (Col 2 in RTL) */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                طريقة استخدام بسيطة لنتائج قوية
              </h2>
              <div
                className="rounded-3xl p-8 shadow-xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shrink-0" style={{ background: "var(--brand-gold)", color: "var(--brand-green)" }}>
                    1
                  </div>
                  <p className="text-white text-lg leading-relaxed font-medium mt-2">{product.howToUse}</p>
                </div>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shrink-0 bg-white/20 text-white">
                    2
                  </div>
                  <p className="text-white text-lg leading-relaxed font-medium mt-2">
                    الاستمرار هو السر. داوم على الاستخدام يومياً لتراكم الفوائد الطبيعية وتلاحظ الفرق بوضوح.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Reviews Section */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{ color: "var(--brand-green)" }}
            >
              قصص نجاح من زبائننا
            </h2>
            <p className="text-gray-500 text-lg font-medium">تجارب من زبائن مغاربة جربوا صحتي في حياتهم اليومية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.reviews.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white shadow-sm"
                    style={{ background: "var(--brand-green)" }}
                  >
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-black text-lg" style={{ color: "var(--brand-green)" }}>{r.name}</div>
                    <div className="text-sm font-bold text-gray-500">{r.city} • {r.date}</div>
                  </div>
                </div>
                <div className="stars text-xl mb-4">{"★".repeat(r.rating)}</div>
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-6 inline-block text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-max" style={{ background: "var(--brand-cream-dark)", color: "var(--brand-green)" }}>
                  <span style={{ color: "var(--brand-gold)" }}>✓</span> مشترٍ مؤكد
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ: Text Right, Image Left */}
      <section className="py-16 md:py-24" style={{ background: "var(--brand-cream)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Right (Col 1 in RTL) */}
            <div>
              <h2
                className="text-3xl md:text-4xl font-black mb-8 leading-tight"
                style={{ color: "var(--brand-green)" }}
              >
                أسئلة شائعة
              </h2>
              <div className="space-y-4">
                {product.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm"
                  >
                    <summary
                      className="p-6 font-black text-lg cursor-pointer list-none flex justify-between items-center"
                      style={{ color: "var(--brand-green)" }}
                    >
                      {faq.q}
                      <span className="text-2xl font-light group-open:rotate-45 transition-transform" style={{ color: "var(--brand-gold)" }}>
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-base text-gray-600 leading-relaxed font-medium border-t border-gray-50 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
            
            {/* Image Left (Col 2 in RTL) */}
            <div className="h-full">
              <ImagePlaceholder 
                productName="لديك أسئلة؟" 
                text="نحن هنا للمساعدة بكل شفافية" 
                emoji="💬" 
                bgColor="var(--brand-sage)"
                color="var(--brand-green)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA + Cross-sells */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <CrossSells
          products={crossSells}
          title="أكمل صحتك — منتجات ننصح بها أيضاً"
          subtitle="زبائننا الذين جربوا هذا المنتج اشتروا أيضاً"
        />
      </section>

      {/* Sticky bottom bar on mobile */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 border-t border-gray-200 shadow-2xl"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-black" style={{ color: "var(--brand-green)" }}>
              {product.price} درهم
            </div>
            <div className="text-xs font-bold" style={{ color: "var(--brand-green)" }}>دفع عند الاستلام ✓</div>
          </div>
          <div className="flex-1">
            <AddToCartButton product={product} compact />
          </div>
        </div>
      </div>
      <div className="h-24 md:h-0" />
    </div>
  );
}
