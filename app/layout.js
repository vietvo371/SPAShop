import { Gotu, Dongle, Roboto } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";

const gotu = Gotu({
  subsets: ["latin", "vietnamese"],
  weight: ["400"],
  variable: "--font-gotu",
});

const dongle = Dongle({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-dongle",
});

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Chân An Energy Healing - Khỏe Từ Bên Trong",
  description:
    "Chân An Energy Healing - Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa (FIR). Chuyên điều trị Gout, soi mạch máu, đo 12 đường kinh lạc tại Vũng Tàu.",
  keywords:
    "Chân An, Energy Healing, hồng ngoại xa, FIR, sức khỏe, Vũng Tàu, điều trị Gout",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${roboto.variable} ${gotu.variable} ${dongle.variable} ${roboto.className}`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
