import Image from "next/image";

export const metadata = {
  title: "Dịch Vụ Chăm Sóc - Tâm An Energy Healing",
  description: "Khám phá các dịch vụ chăm sóc sức khỏe bằng công nghệ hồng ngoại xa tại Tâm An: Điều trị Gout, Soi mạch máu, Đo 12 đường kinh lạc.",
};

const services = [
  {
    id: 1,
    title: "Khai thông vùng đầu",
    desc: "Thải độc chuyên sâu vùng đầu và mặt bằng công nghệ ánh sáng sinh học (FIR), giúp trẻ hóa và giảm căng thẳng thần kinh hiệu quả.",
    image: "/images/services/head_face_detox.png",
    features: ["Nâng cơ mặt, trẻ hóa da", "Detox da đầu, giảm mụn/nám", "Giảm đau đầu & stress"],
  },
  {
    id: 2,
    title: "Cổ vai gáy",
    desc: "Trị liệu chuyên sâu giúp giải tỏa cơn đau mỏi, co cứng cơ vùng cổ vai gáy, cải thiện đáng kể tình trạng tê bì tay chân.",
    image: "/images/services/neck_shoulder.png",
    features: ["Khơi thông kinh lạc", "Giảm co cứng cơ", "Tăng tuần hoàn máu não"],
  },
  {
    id: 3,
    title: "Thắt lưng eo",
    desc: "Hỗ trợ phục hồi và giảm áp lực lên cột sống thắt lưng, vùng eo, giúp cơ thể linh hoạt và giảm thiểu các cơn đau mãn tính.",
    image: "/images/services/back_waist.png",
    features: ["Hỗ trợ thoát vị đĩa đệm", "Giảm đau lưng mãn tính", "Cải thiện độ linh hoạt"],
  },
  {
    id: 4,
    title: "Hông - Chân",
    desc: "Đặc trị các vấn đề về thần kinh và khớp từ vùng hông xuống chân, đặc biệt hiệu quả với người bị đau thần kinh tọa.",
    image: "/images/services/hip_leg.png",
    features: ["Giảm đau thần kinh tọa", "Trị tê bì chân tay", "Tăng sức mạnh khớp hông"],
  },
  {
    id: 5,
    title: "Bài độc gan",
    desc: "Liệu pháp thanh lọc gan tự nhiên, giúp đào thải độc tố tích tụ, hỗ trợ cải thiện các bệnh lý về gan và hệ tiêu hóa.",
    image: "/images/services/liver_detox.png",
    features: ["Thải độc tố tích tụ", "Giảm mỡ máu", "Cải thiện tiêu hóa"],
  },
  {
    id: 6,
    title: "Phục hồi thận khí",
    desc: "Tăng cường chức năng thận, cải thiện tình trạng tiểu đêm, mệt mỏi và phục hồi sinh lực từ gốc bằng liệu pháp không xâm lấn.",
    image: "/images/services/kidney_recovery.png",
    features: ["Giảm tiểu đêm", "Tăng chất lượng giấc ngủ", "Phục hồi sinh lực"],
  },
  {
    id: 7,
    title: "Dưỡng phế",
    desc: "Chăm sóc và tăng cường sức khỏe hệ hô hấp, giúp giảm dị ứng thời tiết và tăng khả năng kháng khuẩn tự nhiên cho phổi.",
    image: "/images/services/lung_care.png",
    features: ["Tăng sức đề kháng", "Giảm dị ứng thời tiết", "Phục hồi hệ hô hấp"],
  },
  {
    id: 8,
    title: "Kiện tỳ vị",
    desc: "Cân bằng hệ tiêu hóa, giúp cơ thể hấp thụ dưỡng chất tốt hơn và tăng cường hệ miễn dịch tổng quát từ tỳ vị.",
    image: "/images/services/spleen_stomach.png",
    features: ["Cải thiện đường ruột", "Giúp ăn ngon ngủ tốt", "Tăng cường miễn dịch"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Dịch Vụ Chăm Sóc</h1>
          <p>Các liệu pháp chăm sóc sức khỏe hàng đầu tại Tâm An với công nghệ Hồng ngoại xa (FIR)</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="mission-grid" 
              style={{ direction: index % 2 === 1 ? "rtl" : "ltr", borderBottom: index < services.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", paddingBottom: index < services.length - 1 ? "80px" : "0" }}
            >
              <div className="mission-text" style={{ direction: "ltr" }}>
                <h2 style={{ fontSize: "1.8rem", color: "var(--color-primary)", marginBottom: "20px" }}>
                  {service.title}
                </h2>
                <p style={{ color: "var(--color-text-main)", lineHeight: 1.8, marginBottom: "24px" }}>
                  {service.desc}
                </p>
                <ul style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr", 
                  gap: "12px", 
                  marginBottom: "30px",
                  padding: 0,
                  listStyle: "none"
                }}>
                  {service.features.map((f, i) => (
                    <li key={i} style={{ fontSize: "0.9rem", color: "var(--color-dark)", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "var(--color-primary)", display: "flex", flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </span> {f}
                    </li>
                  ))}
                </ul>
                <a href="tel:+84824368694" className="btn-book-service" style={{ maxWidth: "250px", alignSelf: "flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "8px" }}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  Đặt Lịch Ngay
                </a>
              </div>
              <div className="page-image-wrapper" style={{ height: "400px" }}>
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill 
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
