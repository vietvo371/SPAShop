import ContactFormEnhanced from "../components/ContactFormEnhanced";

export const metadata = {
  title: "Liên Hệ - Tâm An Energy Healing",
  description: "Liên hệ Tâm An Energy Healing tại Vũng Tàu. Hotline: +84 824 368 694. Đặt lịch hẹn và tư vấn miễn phí.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Liên Hệ</h1>
          <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "8px" }}>
                Gửi Tin Nhắn
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--color-gray)", marginBottom: "24px" }}>
                Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
              </p>
              <ContactFormEnhanced />
            </div>

            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "8px" }}>
                Thông Tin Liên Hệ
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--color-gray)", marginBottom: "24px" }}>
                Đến trực tiếp hoặc liên hệ qua các kênh sau:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, label: "Địa chỉ", value: "02 Phan Long Bằng, Quảng Ngãi" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, label: "Hotline", value: "035 630 8211" },
                  /* { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, label: "Email", value: "info@chanan.vn" }, */
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>, label: "Giờ làm việc", value: "Thứ 2 - Chủ nhật: 8:00 - 20:00" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    padding: "16px",
                    background: "var(--color-cream)",
                    borderRadius: "var(--radius-sm)",
                  }}>
                    <span style={{ flexShrink: 0, marginTop: "2px" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "var(--color-dark)" }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div style={{ marginTop: "24px", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <iframe
                  src="https://www.google.com/maps?q=02+Phan+Long+Băng,+Quảng+Ngãi&output=embed"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Tâm An Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
