"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Link from "next/link";

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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

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
    infinite: services.length > slidesToShow,
    speed: 600,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (loading) {
    return (
      <section className="services-section" id="services">
        <div className="container">
          <h2 className="section-title">Dịch Vụ Chăm Sóc Sức Khỏe</h2>
          <div style={{ textAlign: "center", padding: "100px 0" }}>Đang tải dịch vụ...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="services-section" id="services">
      <div className="container">
        <h2 className="section-title">Dịch Vụ Chăm Sóc Sức Khỏe</h2>
        <p className="section-subtitle">
          Phục hồi sức khỏe chuyên sâu, tái tạo năng lượng từ bên trong
        </p>
        <div className="service-slider-wrapper">
          {services.length > 0 ? (
            <Slider key={`service-slider-${slidesToShow}`} {...settings}>
              {services.map((service) => (
                <div key={service.id} className="service-slide-item">
                  <div className="service-info-card">
                    <div className="service-card-header">
                      <h3 className="service-card-title">{service.name}</h3>
                      <p className="service-card-desc">{service.description}</p>
                    </div>
                    <div className="service-card-body">
                      <div className="service-detail-row">
                        <span className="detail-label">
                          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a8 8 0 0 1-10 10Z" /><path d="M6 12l-2 2zm2 2l-2 2zm2 2l-2 2z" /></svg>
                          Quy trình:
                        </span>
                        <span className="detail-value">{service.process || "Thăm khám → Trị liệu → Phục hồi"}</span>
                      </div>
                      <div className="service-detail-row">
                        <span className="detail-label">
                          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                          Giá lẻ:
                        </span>
                        <span className="detail-value">{service.price || "Đang cập nhật"}</span>
                      </div>
                      <div className="service-detail-row">
                        <span className="detail-label">
                          <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          Liệu trình:
                        </span>
                        <span className="detail-value">{service.duration || "Đang cập nhật"}</span>
                      </div>
                    </div>
                    <div className="service-card-footer">
                      <Link href="/lien-he" className="service-book-btn">
                        BOOK LỊCH HẸN
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>Không có dịch vụ nào.</div>
          )}
        </div>
      </div>
    </section>
  );
}
