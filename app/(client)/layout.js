import { redirect } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import ZaloWidget from "@/app/components/ZaloWidget";
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
    </>
  );
}

function FloatingPhone() {
  return (
    <a
      href="tel:+84356308211"
      style={{
        position: "fixed",
        right: "20px",
        bottom: "30px",
        zIndex: 900,
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "var(--color-primary)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        boxShadow: "0 4px 20px rgba(104, 10, 178, 0.4)",
        textDecoration: "none",
        animation: "pulse 2s ease infinite",
      }}
      aria-label="Gọi điện"
    >
      📞
    </a>
  );
}