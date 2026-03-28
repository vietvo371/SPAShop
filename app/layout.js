import { Montserrat } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const metadata = {
  metadataBase: new URL("https://www.chanan.vn"),
  title: {
    default: "Chân An Energy Healing - Khỏe Từ Bên Trong",
    template: "%s | Chân An Energy Healing",
  },
  description:
    "Chân An Energy Healing - Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Vũng Tàu. Chuyên điều trị Gout, soi mạch máu, đo 12 đường kinh lạc. Hotline: +84 824 368 694.",
  keywords: [
    "Chân An",
    "Energy Healing",
    "hồng ngoại xa",
    "FIR",
    "Far Infrared",
    "sức khỏe",
    "Vũng Tàu",
    "điều trị Gout",
    "soi mạch máu",
    "đường kinh lạc",
    "chăm sóc sức khỏe",
    "thảm đá ngọc",
    "trang sức hồng ngoại",
  ],
  authors: [{ name: "Chân An Energy Healing" }],
  creator: "Chân An Energy Healing",
  publisher: "Chân An Energy Healing",
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
    icon: "/faci.png",
    shortcut: "/faci.png",
    apple: "/faci.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://www.chanan.vn",
    siteName: "Chân An Energy Healing",
    title: "Chân An Energy Healing - Khỏe Từ Bên Trong",
    description:
      "Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Vũng Tàu. Chuyên điều trị Gout, soi mạch máu, đo 12 đường kinh lạc.",
    images: [
      {
        url: "/images/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "Chân An Energy Healing - Trung tâm chăm sóc sức khỏe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chân An Energy Healing - Khỏe Từ Bên Trong",
    description:
      "Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR) tại Vũng Tàu.",
    images: ["/images/hero-banner.png"],
  },
  alternates: {
    canonical: "https://www.chanan.vn",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={montserrat.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
