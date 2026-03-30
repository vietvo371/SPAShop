export const metadata = {
  title: "Hợp Tác Cùng Tâm An - Cơ Hội Kinh Doanh",
  description: "Cùng Tâm An phát triển kinh doanh trong lĩnh vực chăm sóc sức khỏe bằng công nghệ hồng ngoại xa.",
};

const benefits = [
  { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>, title: "Tăng Trưởng Bền Vững", desc: "Ngành sức khỏe luôn phát triển — đầu tư vào tương lai của bạn và cộng đồng." },
  { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>, title: "Hỗ Trợ Toàn Diện", desc: "Được đào tạo chuyên sâu về sản phẩm, quy trình bán hàng và chăm sóc khách hàng." },
  { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>, title: "Sản Phẩm Chất Lượng", desc: "Sản phẩm FIR đạt tiêu chuẩn quốc tế, được chứng nhận bởi các tổ chức uy tín." },
  { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>, title: "Hoa Hồng Hấp Dẫn", desc: "Chính sách hoa hồng cạnh tranh và nhiều chương trình khuyến mãi hấp dẫn." },
  { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z"/></svg>, title: "Đa Dạng Sản Phẩm", desc: "Danh mục sản phẩm phong phú, đáp ứng nhu cầu đa dạng của thị trường." },
  { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>, title: "Mở Rộng Thị Trường", desc: "Cơ hội mở rộng mạng lưới kinh doanh trên toàn quốc." },
];

export default function PartnershipPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Hợp Tác Cùng Tâm An</h1>
          <p>Cùng nhau kiến tạo sức khỏe — Cùng nhau phát triển</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "var(--color-primary)", marginBottom: "16px" }}>
              Tại Sao Hợp Tác Với Tâm An?
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--color-gray)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.7 }}>
              Tâm An Energy Healing mở rộng mạng lưới đối tác trên toàn quốc.
              Hãy cùng chúng tôi mang sức khỏe đến mọi gia đình Việt.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "60px" }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                background: "var(--color-cream)",
                padding: "32px",
                borderRadius: "var(--radius-md)",
                textAlign: "center",
                boxShadow: "var(--shadow-sm)",
                transition: "var(--transition)",
              }}>
                <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>{b.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-dark)", marginBottom: "10px" }}>{b.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-gray)", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
            borderRadius: "var(--radius-lg)",
            padding: "60px 40px",
            textAlign: "center",
            color: "var(--color-white)",
          }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>
              Sẵn Sàng Hợp Tác?
            </h2>
            <p style={{ fontSize: "1.05rem", opacity: 0.9, marginBottom: "30px", maxWidth: "500px", margin: "0 auto 30px" }}>
              Liên hệ ngay để nhận thông tin chi tiết về chương trình đối tác
            </p>
            <a href="tel:+84824368694" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 40px",
              border: "2px solid var(--color-white)",
              borderRadius: "50px",
              color: "var(--color-white)",
              fontSize: "0.9rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "2px",
              textDecoration: "none",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              Gọi Ngay: +84 824 368 694
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
