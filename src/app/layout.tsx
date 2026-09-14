import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import CartDrawer from "@/components/CartDrawer";
import Pixels from "@/components/Pixels";

export const metadata: Metadata = {
  title: "صحتي — حلول طبيعية لمشاكل حقيقية",
  description:
    "صحتي هي متجرك المغربي الأول للصحة الطبيعية. منتجات طبيعية 100% لمشاكل المفاصل، الهضم، والأسنان. الدفع عند الاستلام في جميع أنحاء المغرب.",
  keywords: "صحتي, صحة طبيعية, مغرب, أعشاب, مسواك, مفاصل, هضم, COD",
  openGraph: {
    title: "صحتي — صحتك، طبيعية",
    description: "حلول طبيعية لمشاكل حقيقية — منتجات مغربية موثوقة",
    locale: "ar_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Pixels />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CheckoutModal />
      </body>
    </html>
  );
}
