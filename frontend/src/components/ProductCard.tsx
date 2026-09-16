"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/products";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

export default function ProductCard({ product, showBadge }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openDrawer();
    }, 600);
  };

  return (
    <div className="product-card rounded-3xl overflow-hidden flex flex-col" style={{ background: "white", border: "1.5px solid var(--brand-cream-dark)" }}>
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div
          className="relative flex items-center justify-center"
          style={{
            background: `linear-gradient(145deg, var(--brand-green) 0%, var(--brand-green-light) 100%)`,
            height: "200px",
          }}
        >
          <span className="text-7xl filter drop-shadow-lg">{product.emoji}</span>
          {showBadge && (
            <span
              className="absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: "var(--brand-gold)", color: "var(--brand-green)" }}
            >
              {product.tagline}
            </span>
          )}
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: "linear-gradient(to bottom, transparent, rgba(18,60,45,0.15))" }} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="stars text-sm">★★★★★</span>
          <span className="text-xs font-bold" style={{ color: "var(--brand-muted)" }}>
            ({product.reviews.length * 38 + 124})
          </span>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-black mb-1.5 leading-snug hover:underline" style={{ color: "var(--brand-green)" }}>
            {product.nameAr}
          </h3>
        </Link>
        <p className="text-sm leading-relaxed flex-1 line-clamp-2 mb-4" style={{ color: "var(--brand-muted)" }}>
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4 py-3 border-t border-b" style={{ borderColor: "var(--brand-cream-dark)" }}>
          <div>
            <span className="text-2xl font-black" style={{ color: "var(--brand-green)" }}>199</span>
            <span className="text-sm font-bold mr-1" style={{ color: "var(--brand-muted)" }}>د.م</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--brand-sage)", color: "var(--brand-green)" }}>
            💳 دفع عند الاستلام
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className="btn-primary text-sm py-3 rounded-xl"
          style={added ? { background: "var(--brand-gold)", color: "var(--brand-green)" } : {}}
        >
          {added ? "✓ أُضيف للسلة" : "أضف إلى السلة"}
        </button>

        <Link
          href={`/products/${product.slug}`}
          className="text-center text-xs mt-2.5 font-bold"
          style={{ color: "var(--brand-muted)" }}
        >
          شاهد التفاصيل ←
        </Link>
      </div>
    </div>
  );
}
