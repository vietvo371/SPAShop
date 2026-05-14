"use client";

import { useSettings } from "@/app/context/SettingsContext";

export default function BannerCTA() {
  const { settings } = useSettings();
  const cleanPhone = settings.phone ? settings.phone.replace(/\s+/g, "") : "0356308211";

  return (
    <section 
      className="banner-cta" 
      style={{ 
        backgroundImage: "url('/images/banner-cta-new.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="banner-overlay"></div>
      <div className="container banner-container">
        <div className="banner-content">
          <h2 className="banner-title section-title" style={{ color: "white" }}>Phục Hồi Sức Khỏe Thuận Tự Nhiên</h2>
          <p className="banner-desc">
            Bằng việc kết hợp Công nghệ Hồng Ngoại Xa (FIR), thiết bị chính hãng và tinh hoa Y học cổ truyền (YHCT), Tâm An mang đến các liệu pháp an toàn – không xâm lấn – dễ chịu, phù hợp với nhịp sống hiện đại và hướng tới sức khỏe bền vững.
          </p>
          <div className="banner-actions">
            <a href={`tel:${cleanPhone}`} className="cta-btn primary">
              GỌI NGAY: {settings.phone || "035 630 8211"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
