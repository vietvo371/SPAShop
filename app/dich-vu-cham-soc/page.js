import Image from "next/image";

export const metadata = {
  title: "Dịch Vụ Chăm Sóc - Chân An Energy Healing",
  description: "Khám phá các dịch vụ chăm sóc sức khỏe bằng công nghệ hồng ngoại xa tại Chân An: Điều trị Gout, Soi mạch máu, Đo 12 đường kinh lạc.",
};

const services = [
  {
    id: 1,
    title: "Chuyên Điều Trị Gout",
    desc: "Liệu pháp hồng ngoại xa (FIR) giúp giảm đau, giảm viêm và hỗ trợ tuần hoàn máu hiệu quả cho bệnh nhân Gout. Phương pháp tự nhiên, an toàn, không tác dụng phụ.",
    image: "/images/hero-banner.png",
    features: ["Giảm đau nhanh chóng", "Hỗ trợ tuần hoàn máu", "Không tác dụng phụ", "Kết quả sau 2-4 tuần"],
  },
  {
    id: 2,
    title: "Soi Mạch Máu Vi Tuần Hoàn",
    desc: "Kiểm tra vi tuần hoàn máu bằng kính hiển vi chuyên dụng, giúp phát hiện sớm các vấn đề về mạch máu, đánh giá tình trạng sức khỏe tổng thể.",
    image: "/images/service-blood.png",
    features: ["Phát hiện sớm bệnh lý", "Kết quả nhanh trong 15 phút", "Không xâm lấn", "Tư vấn chi tiết từ chuyên gia"],
  },
  {
    id: 3,
    title: "Đo 12 Đường Kinh Lạc",
    desc: "Đánh giá tình trạng sức khỏe tổng thể thông qua hệ thống 12 đường kinh lạc theo y học cổ truyền, kết hợp công nghệ hiện đại.",
    image: "/images/service-meridian.png",
    features: ["Đánh giá toàn diện", "Kết hợp y học cổ truyền", "Chẩn đoán chính xác", "Lộ trình điều trị cá nhân"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Dịch Vụ Chăm Sóc</h1>
          <p>Các liệu pháp chăm sóc sức khỏe hàng đầu tại Chân An</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          {services.map((service, index) => (
            <div key={service.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              alignItems: "center",
              marginBottom: "60px",
              direction: index % 2 === 1 ? "rtl" : "ltr",
            }}>
              <div style={{ position: "relative", height: "350px", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-md)", direction: "ltr" }}>
                <Image src={service.image} alt={service.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div style={{ direction: "ltr" }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "16px" }}>
                  {service.title}
                </h2>
                <p style={{ fontSize: "0.95rem", color: "var(--color-gray)", lineHeight: 1.8, marginBottom: "20px" }}>
                  {service.desc}
                </p>
                <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                  {service.features.map((f, i) => (
                    <li key={i} style={{ fontSize: "0.85rem", color: "var(--color-dark)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </span> {f}
                    </li>
                  ))}
                </ul>
                <a href="tel:+84824368694" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 32px",
                  background: "var(--color-primary)",
                  color: "var(--color-white)",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textDecoration: "none",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  Đặt Lịch Hẹn
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
