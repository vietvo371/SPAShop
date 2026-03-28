import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Google Maps */}
      <iframe
        className="footer-map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.123456789!2d107.08!3d10.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zVsW8bmcgVMOgdQ!5e0!3m2!1svi!2s!4v1234567890"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Chân An Location"
      />

      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Image
                src="/images/logo.png"
                alt="Chân An Logo"
                width={50}
                height={50}
                style={{ borderRadius: "50%" }}
              />
              <div className="footer-logo-text">Chân An Energy Healing</div>
            </div>
            <p className="footer-desc">
              Trung tâm chăm sóc sức khỏe uy tín với công nghệ hồng ngoại xa (FIR) tiên tiến.
              Sứ mệnh mang lại sức khỏe toàn diện cho cộng đồng.
            </p>
            <div className="footer-socials">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube">
                YT
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                FB
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="TikTok">
                TT
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                IG
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">Liên Kết</h3>
            <Link href="/cau-chuyen-chan-an" className="footer-link">Về Chân An</Link>
            <Link href="/dich-vu-cham-soc" className="footer-link">Dịch Vụ Chăm Sóc</Link>
            <Link href="/san-pham" className="footer-link">Sản Phẩm Công Nghệ</Link>
            <Link href="/kien-thuc" className="footer-link">Kiến Thức</Link>
            <Link href="/hop-tac-cung-chan-an" className="footer-link">Hợp Tác</Link>
            <Link href="/lien-he" className="footer-link">Liên Hệ</Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-heading">Liên Hệ</h3>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </span>
              <span>Vũng Tàu, Bà Rịa - Vũng Tàu, Việt Nam</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </span>
              <span>+84 824 368 694</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </span>
              <span>info@chanan.vn</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              </span>
              <span>Thứ 2 - Chủ nhật: 8:00 - 20:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2026 Chân An Energy Healing. All rights reserved.
      </div>
    </footer>
  );
}
