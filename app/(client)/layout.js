import { redirect } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import ZaloWidget from "@/app/components/ZaloWidget";
import FloatingPhone from "@/app/components/FloatingPhone";
import ScrollToTop from "@/app/components/ScrollToTop";
import { getCurrentUser } from "@/app/lib/auth";

export default async function ClientLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh", paddingTop: "100px" }}>
        {children}
      </main>
      <Footer />
      <ZaloWidget />
      <FloatingPhone />
      <ScrollToTop />
    </>
  );
}