"use client";

import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

interface CrossSellsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function CrossSells({
  products,
  title = "قد يعجبك أيضاً",
  subtitle = "زبائننا الذين اشتروا هذا المنتج اشتروا أيضاً",
}: CrossSellsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 py-12 border-t border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--brand-green)" }}>
          {title}
        </h2>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} showBadge />
        ))}
      </div>
    </section>
  );
}
