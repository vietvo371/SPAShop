"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Khai thông vùng đầu",
    desc: "Thư giãn chuyên sâu vùng đầu – cổ – vai, giảm đau nhức, giải tỏa căng thẳng, cải thiện giấc ngủ và giúp tinh thần tỉnh táo hơn.",
    process: "Thăm khám → Làm sạch da đầu → Massage huyệt đạo → Ủ tinh dầu → Thư giãn hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, duy trì 2–3 lần/tuần để đạt hiệu quả tối ưu",
    link: "/lien-he"
  },
  {
    id: 2,
    title: "Cổ vai gáy",
    desc: "Liệu trình chuyên sâu giúp giảm đau mỏi, giải phóng căng cơ vùng cổ – vai – gáy, hỗ trợ lưu thông máu và cải thiện giấc ngủ.",
    process: "Thăm khám → Xông nóng thư giãn → Massage trị liệu → Bấm huyệt → Ủ nóng → Hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, 2–3 lần/tuần giúp giảm đau rõ rệt và duy trì hiệu quả lâu dài",
    link: "/lien-he"
  },
  {
    id: 3,
    title: "Thắt lưng eo",
    desc: "Giảm đau mỏi vùng thắt lưng – eo, thư giãn cơ sâu, hỗ trợ lưu thông khí huyết và cải thiện vận động linh hoạt.",
    process: "Thăm khám → Làm nóng vùng lưng → Massage trị liệu → Bấm huyệt → Ủ nóng → Hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, 2–3 lần/tuần giúp giảm đau rõ rệt và duy trì hiệu quả lâu dài",
    link: "/lien-he"
  },
  {
    id: 4,
    title: "Hông - Chân",
    desc: "Giảm đau mỏi hông – chân, tăng tuần hoàn máu, giúp đôi chân nhẹ nhàng và linh hoạt hơn sau ngày dài vận động.",
    process: "Thăm khám → Ngâm/ủ ấm → Massage trị liệu → Bấm huyệt → Kéo giãn nhẹ → Hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, 2–3 lần/tuần giúp giảm mỏi, cải thiện vận động và duy trì hiệu quả lâu dài",
    link: "/lien-he"
  },
  {
    id: 5,
    title: "Bài độc gan",
    desc: "Hỗ trợ thanh lọc cơ thể, giải độc gan, giảm nóng trong, mệt mỏi, giúp da sáng và cơ thể nhẹ nhàng hơn.",
    process: "Thăm khám → Uống thảo dược → Massage vùng gan → Bấm huyệt hỗ trợ đào thải → Ủ ấm → Hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, 2–3 lần/tuần giúp cơ thể thanh lọc và duy trì sức khỏe tốt hơn",
    link: "/lien-he"
  },
  {
    id: 6,
    title: "Phục hồi thận khí",
    desc: "Liệu trình hỗ trợ tăng cường sinh lực, giảm mệt mỏi, cải thiện giấc ngủ và cân bằng cơ thể từ bên trong.",
    process: "Thăm khám → Làm ấm vùng thắt lưng → Massage – bấm huyệt → Ủ thảo dược → Thư giãn hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, 2–3 lần/tuần giúp cải thiện thể trạng và duy trì năng lượng ổn định",
    link: "/lien-he"
  },
  {
    id: 7,
    title: "Dưỡng phế",
    desc: "Hỗ trợ thanh lọc phổi, giải độc phổi, giảm cảm giác nặng ngực, tăng cường hô hấp và giúp cơ thể dễ chịu, nhẹ nhàng hơn.",
    process: "Thăm khám → Xông thảo dược → Massage vùng ngực – lưng → Bấm huyệt hỗ trợ hô hấp → Ủ ấm → Hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, 2–3 lần/tuần giúp cải thiện hô hấp và duy trì sức khỏe lâu dài",
    link: "/lien-he"
  },
  {
    id: 8,
    title: "Kiện tuỳ vị",
    desc: "Hỗ trợ tăng cường tiêu hoá, giảm đầy hơi – khó tiêu, giúp cơ thể hấp thu tốt hơn và nhẹ bụng sau mỗi bữa ăn.",
    process: "Thăm khám → Làm ấm vùng bụng → Massage tỳ vị → Bấm huyệt hỗ trợ tiêu hoá → Ủ ấm → Hoàn tất",
    price: "Đang cập nhật",
    course: "Combo 5 – 10 buổi, 2–3 lần/tuần giúp cải thiện tiêu hoá và duy trì cơ thể khỏe mạnh lâu dài",
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
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="services-section" id="services">
      <div className="container">
        <h2 className="section-title">Dịch Vụ Chăm Sóc Sức Khỏe</h2>
        <p className="section-subtitle">
          Phục hồi sức khỏe chuyên sâu, tái tạo năng lượng từ bên trong
        </p>
        <div className="service-slider-wrapper">
          <Slider key={`service-slider-${slidesToShow}`} {...settings}>
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
                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-10 10Z" /><path d="M6 12l-2 2zm2 2l-2 2zm2 2l-2 2z" /></svg>
                        Quy trình:
                      </span>
                      <span className="detail-value">{service.process}</span>
                    </div>
                    <div className="service-detail-row">
                      <span className="detail-label">
                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                        Giá lẻ:
                      </span>
                      <span className="detail-value">{service.price}</span>
                    </div>
                    <div className="service-detail-row">
                      <span className="detail-label">
                        <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
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
