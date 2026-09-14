"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  compact?: boolean;
}

export default function AddToCartButton({ product, compact }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openDrawer();
    }, 600);
  };

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className="btn-gold py-3 text-sm"
        style={{ borderRadius: "12px" }}
      >
        {added ? "✓ أُضيف" : "أضف للسلة 🛒"}
      </button>
    );
  }

  return (
    <button onClick={handleAdd} className="btn-gold cta-pulse text-lg py-5">
      {added ? (
        <span>✓ أُضيف للسلة — تفتح الآن...</span>
      ) : (
        <>
          <span>أضف للسلة والمتابعة</span>
          <span>←</span>
        </>
      )}
    </button>
  );
}
