"use client";

import Link from "next/link";
import { useSettings } from "@/app/context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="footer">
      {/* Google Maps */}
      <iframe
        className="footer-map"
        src={settings.mapsUrl || "https://www.google.com/maps?q=02+Phan+Long+Băng,+Quảng+Ngãi&output=embed"}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Tâm An Location"
      />

      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img
                src="https://res.cloudinary.com/dltbjoii4/image/upload/v1776185343/chanan/lwfwyyscovwb6zunswo9.png"
                alt="Tâm An Logo"
                width={167}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="footer-desc">
              Trung tâm chăm sóc sức khỏe uy tín với công nghệ hồng ngoại xa (FIR) tiên tiến.
              Sứ mệnh mang lại sức khỏe toàn diện cho cộng đồng.
            </p>
            <div className="footer-socials">
              <a href="https://www.youtube.com/@bichphuongyoga788" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.facebook.com/bphuong.yoga" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@phuonghongngoaixa?_r=1&_t=ZS-96LuSS9Kcrs" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.032 2.61-.019 3.91-.019a5.151 5.151 0 0 0 1.21 4.74 5.926 5.926 0 0 0 3.12 1.352v3.29a9.027 9.027 0 0 1-5.735-2.035v8.382a5.58 5.58 0 0 1-9.04 4.03 5.731 5.731 0 0 1-1.33-6.31 5.566 5.566 0 0 1 5.225-3.356c.127-.001.253.002.38.008V13.3a2.433 2.433 0 0 0-2.403 2.431 2.451 2.451 0 0 0 2.471 2.442 2.431 2.431 0 0 0 2.191-2.437V0l.001.02z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">Liên Kết</h3>
            <Link href="/gioi-thieu" className="footer-link">Về Tâm An</Link>
            <Link href="/dich-vu-cham-soc" className="footer-link">Dịch Vụ Chăm Sóc</Link>
            <Link href="/san-pham" className="footer-link">Sản Phẩm Công Nghệ</Link>
            <Link href="/kien-thuc" className="footer-link">Kiến Thức</Link>
            <Link href="/tu-van-lieu-trinh" className="footer-link">Tư Vấn Liệu Trình</Link>
            <Link href="/lien-he" className="footer-link">Liên Hệ</Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-heading">Liên Hệ</h3>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </span>
              <span>{settings.address || "02 Phan Long Bằng, Quảng Ngãi"}</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </span>
              <span>{settings.phone || "035 630 8211"}</span>
            </div>
            {settings.email && (
              <div className="footer-contact-item">
                <span className="footer-contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </span>
                <span>{settings.email}</span>
              </div>
            )}
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8-3.58 8-8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              </span>
              <span>{settings.openHours || "Thứ 2 - Chủ nhật: 8:00 - 20:00"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} {settings.businessName || "Tâm An Energy Healing"}. All rights reserved.
      </div>
    </footer>
  );
}
