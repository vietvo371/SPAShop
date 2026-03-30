import Image from "next/image";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Chuyên Điều Trị Gout",
    desc: "Liệu pháp hồng ngoại xa giúp giảm đau, giảm viêm và hỗ trợ tuần hoàn máu hiệu quả cho bệnh nhân Gout.",
    image: "/images/hero-banner.png",
  },
  {
    id: 2,
    title: "Soi Mạch Máu",
    desc: "Kiểm tra vi tuần hoàn máu bằng kính hiển vi chuyên dụng, phát hiện sớm các vấn đề về mạch máu.",
    image: "/images/service-blood.png",
  },
  {
    id: 3,
    title: "Đo 12 Đường Kinh Lạc",
    desc: "Đánh giá tình trạng sức khỏe tổng thể qua hệ thống 12 đường kinh lạc theo y học cổ truyền.",
    image: "/images/service-meridian.png",
  },
];

export default function ServiceGrid() {
  return (
    <section className="services-section" id="services">
      <div className="container">
        <h2 className="section-title">Dịch Vụ Chăm Sóc</h2>
        <p className="section-subtitle">
          Trải nghiệm các liệu pháp chăm sóc sức khỏe tiên tiến tại Tâm An
        </p>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-bg">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 968px) 100vw, 33vw"
                />
              </div>
              <div className="service-card-overlay">
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.desc}</p>
                <Link href="/dich-vu-cham-soc" className="service-btn">
                  BOOK LỊCH HẸN
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
