"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useRouter } from "next/navigation";

/** /cart redirects to homepage and opens the drawer */
export default function CartRedirectPage() {
  const openDrawer = useCartStore((s) => s.openDrawer);
  const router = useRouter();

  useEffect(() => {
    openDrawer();
    router.replace("/");
  }, [openDrawer, router]);

  return null;
}
