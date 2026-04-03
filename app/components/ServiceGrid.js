"use client";
import Slider from "react-slick";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Soi Mạch Máu",
    desc: "Quan sát trực quan tình trạng tuần hoàn máu, hình thái mạch và lưu thông.",
    process: "Quan sát qua kính hiển vi công nghệ cao",
    price: "Đang cập nhật",
    course: "15 - 20 phút / lần",
    link: "/lien-he"
  },
  {
    id: 2,
    title: "Đo 12 Đường Kinh Lạc",
    desc: "Phân tích năng lượng cơ thể, tìm nguyên nhân gốc rễ vấn đề sức khỏe.",
    process: "Sử dụng máy phân tích năng lượng Đài Loan",
    price: "Đang cập nhật",
    course: "15 phút / lần",
    link: "/lien-he"
  },
  {
    id: 3,
    title: "Thải Độc Đầu – Mặt",
    desc: "Nâng cơ trẻ hóa da mặt, giải độc tố vùng da đầu chuyên sâu.",
    process: "Massage ấn huyệt kết hợp ánh sáng sinh học",
    price: "Đang cập nhật",
    course: "60 phút / liệu trình",
    link: "/lien-he"
  },
  {
    id: 4,
    title: "Bài Hàn Tử Cung",
    desc: "Đào thải độc tố, cải thiện tình trạng kinh nguyệt và phục hồi tử cung.",
    process: "Xông đá muối và chiếu đèn hồng ngoại xa",
    price: "Đang cập nhật",
    course: "45 phút / liệu trình",
    link: "/lien-he"
  },
  {
    id: 5,
    title: "Hỗ Trợ Vấn Đề Về Mắt",
    desc: "Cải thiện mỏi mắt, khô mắt và các vấn đề thị lực.",
    process: "Đai mắt nhiệt FIR kết hợp thảo dược",
    price: "Đang cập nhật",
    course: "20 phút / lần",
    link: "/lien-he"
  },
  {
    id: 6,
    title: "Chuyên Điều Trị Gout",
    desc: "Giảm đau, giảm viêm và hỗ trợ đào thải acid uric hiệu quả.",
    process: "Chiếu đèn hồng ngoại xa kết hợp nén nhiệt",
    price: "Đang cập nhật",
    course: "30 - 45 phút / lần",
    link: "/lien-he"
  }
];

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}

export default function ServiceGrid() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="services-section" id="services">
      <div className="container">
        <h2 className="section-title">Dịch Vụ Chăm Sóc Sức Khỏe</h2>
        <p className="section-subtitle">
          Phục hồi sức khỏe chuyên sâu, tái tạo năng lượng từ bên trong
        </p>
        <div className="service-slider-wrapper">
          <Slider {...settings}>
            {services.map((service) => (
              <div key={service.id} className="service-slide-item">
                <div className="service-info-card">
                  <div className="service-card-header">
                    <h3 className="service-card-title">{service.title}</h3>
                    <p className="service-card-desc">{service.desc}</p>
                  </div>
                  <div className="service-card-body">
                    <div className="service-detail-row">
                      <span className="detail-label">
                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-10 10Z"/><path d="M6 12l-2 2zm2 2l-2 2zm2 2l-2 2z"/></svg>
                        Quy trình:
                      </span>
                      <span className="detail-value">{service.process}</span>
                    </div>
                    <div className="service-detail-row">
                      <span className="detail-label">
                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                        Giá lẻ:
                      </span>
                      <span className="detail-value">{service.price}</span>
                    </div>
                    <div className="service-detail-row">
                      <span className="detail-label">
                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Liệu trình:
                      </span>
                      <span className="detail-value">{service.course}</span>
                    </div>
                  </div>
                  <div className="service-card-footer">
                    <Link href={service.link} className="service-book-btn">
                      BOOK LỊCH HẸN
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
