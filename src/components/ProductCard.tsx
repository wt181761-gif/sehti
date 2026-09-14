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
    <div className="product-card rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div
          className="relative flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${product.bgColor} 0%, white 100%)`,
            height: "220px",
          }}
        >
          <span className="text-7xl">{product.emoji}</span>
          {showBadge && (
            <span
              className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "var(--brand-cream-dark)", color: "var(--brand-green)" }}
            >
              {product.tagline}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`}>
          <h3
            className="text-lg font-bold mb-1 hover:underline"
            style={{ color: "var(--brand-green)" }}
          >
            {product.nameAr}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          <span className="stars text-sm">★★★★★</span>
          <span className="text-xs text-gray-400 mr-1">
            ({product.reviews.length * 38 + 124} تقييم)
          </span>
        </div>

        {/* Price — always 199, no discount shown */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-black" style={{ color: "var(--brand-green)" }}>
            199 درهم
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: "var(--brand-cream-dark)", color: "var(--brand-green)" }}
          >
            دفع عند الاستلام
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className="btn-primary text-sm py-3"
          style={added ? { background: "var(--brand-gold)", color: "var(--brand-green)" } : {}}
        >
          {added ? "✓ أُضيف للسلة" : "أضف إلى السلة 🛒"}
        </button>

        <Link
          href={`/products/${product.slug}`}
          className="text-center text-sm mt-2 font-medium"
          style={{ color: "var(--brand-muted)" }}
        >
          عرض التفاصيل ←
        </Link>
      </div>
    </div>
  );
}
