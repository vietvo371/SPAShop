import localFont from "next/font/local";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import GlobalCart from "./components/GlobalCart";


// const montserrat = Montserrat({
//   subsets: ["latin", "vietnamese"],
//   weight: ["300", "400", "500", "600", "700", "800"],
//   variable: "--font-montserrat",
const thRunalto = localFont({
  src: "../public/fonts/TH-Runalto.ttf",
  variable: "--font-th-runalto",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://suckhoetaman.com"),
  title: {
    default: "Tâm An Energy Healing - Khỏe Từ Bên Trong",
    template: "%s | Tâm An Energy Healing",
  },
  description:
    "Tâm An Energy Healing - Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Quảng Ngãi. Chuyên điều trị Gout, soi mạch máu, đo 12 đường kinh lạc. Hotline: 035 630 8211.",
  keywords: [
    "Tâm An",
    "Energy Healing",
    "hồng ngoại xa",
    "FIR",
    "Far Infrared",
    "sức khỏe",
    "Quảng Ngãi",
    "điều trị Gout",
    "soi mạch máu",
    "đường kinh lạc",
    "chăm sóc sức khỏe",
    "thảm đá ngọc",
    "trang sức hồng ngoại",
  ],
  authors: [{ name: "Tâm An Energy Healing" }],
  creator: "Tâm An Energy Healing",
  publisher: "Tâm An Energy Healing",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://suckhoetaman.com",
    siteName: "Tâm An Energy Healing",
    title: "Tâm An Energy Healing - Khỏe Từ Bên Trong",
    description:
      "Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Quảng Ngãi. Chuyên điều trị Gout, soi mạch máu, đo 12 đường kinh lạc.",
    images: [
      {
        url: "/images/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Tâm An Energy Healing - Trung tâm chăm sóc sức khỏe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tâm An Energy Healing - Khỏe Từ Bên Trong",
    description:
      "Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Quảng Ngãi.",
    images: ["/images/hero-banner.png"],
  },
  // Không đặt canonical ở đây: metadata của layout gốc được kế thừa xuống mọi
  // trang con, nên một canonical cố định sẽ khiến mọi trang tự khai là bản sao
  // của trang chủ và Google bỏ qua toàn bộ. Canonical đặt riêng ở từng trang.
  verification: {
    google: "_-fn-JHZPKazkNkp84kKX9pMPMksfdo28W8gUFNgW-g",
  },
};

import { SettingsProvider } from "./context/SettingsContext";

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${thRunalto.variable}`} suppressHydrationWarning>
      <body className={thRunalto.className}>
        <SettingsProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" richColors />
            <GlobalCart />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
