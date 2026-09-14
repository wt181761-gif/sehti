"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalQty = useCartStore((s) => s.getTotalQty());
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <header className="sticky-header bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl"
            style={{ background: "var(--brand-green)", color: "var(--brand-gold)", fontFamily: "Inter, sans-serif" }}
          >
            S
          </div>
          <div className="flex flex-col">
            <div
              className="text-xl font-black leading-none"
              style={{ color: "var(--brand-green)" }}
            >
              صحتي
            </div>
            <div className="text-[10px] font-bold tracking-widest leading-none mt-1" style={{ color: "var(--brand-green)", fontFamily: "Inter, sans-serif" }}>
              SEHTI
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:opacity-80 transition-opacity" style={{ color: "var(--brand-muted)" }}>
            الرئيسية
          </Link>
          <Link href="/collections" className="hover:opacity-80 transition-opacity" style={{ color: "var(--brand-muted)" }}>
            منتجاتنا
          </Link>
          <Link href="/contact" className="hover:opacity-80 transition-opacity" style={{ color: "var(--brand-muted)" }}>
            تواصل معنا
          </Link>
        </nav>

        {/* Cart icon + Mobile menu */}
        <div className="flex items-center gap-3">
          {/* Cart button — opens drawer */}
          <button
            onClick={openDrawer}
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="فتح سلة التسوق"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: "var(--brand-green)" }}
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalQty > 0 && (
              <span
                className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "var(--brand-gold)", color: "var(--brand-green)" }}
              >
                {totalQty}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-base font-medium">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-2">الرئيسية</Link>
          <Link href="/collections" onClick={() => setMenuOpen(false)} className="py-2">منتجاتنا</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="py-2">تواصل معنا</Link>
          <button
            onClick={() => { setMenuOpen(false); openDrawer(); }}
            className="py-2 text-right flex items-center gap-2"
          >
            🛒 السلة {totalQty > 0 && `(${totalQty})`}
          </button>
        </div>
      )}
    </header>
  );
}
