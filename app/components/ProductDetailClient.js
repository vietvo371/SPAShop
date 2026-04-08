"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

export default function ProductDetailClient({ product, details, relatedProducts }) {
  // Helper to get high-res image
  const getHiRes = (url) => url ? url.replace(/thumbs\/[0-9x]+\//, "") : "";

  const mainProductImage = getHiRes(product.image_url);
  const gallery = details?.gallery_images?.map(getHiRes) || [];
  
  const [activeImage, setActiveImage] = useState(mainProductImage);
  const [activeTab, setActiveTab] = useState("details");

  const sliderSettings = {
    dots: false,
    infinite: relatedProducts.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="product-detail-wrapper">
      <section className="product-main-info" style={{ padding: "40px 0" }}>
        <div className="container">
          <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
            {/* Left: Gallery */}
            <div className="detail-gallery">
              <div className="main-image-container" style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "20px", overflow: "hidden", marginBottom: "20px", border: "1px solid var(--color-beige-dark)" }}>
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              {gallery.length > 0 && (
                <div className="thumb-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                  <div 
                    onMouseEnter={() => setActiveImage(mainProductImage)}
                    className={`thumb-item ${activeImage === mainProductImage ? "active" : ""}`}
                    style={{ position: "relative", aspectRatio: "1/1", borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: activeImage === mainProductImage ? "2px solid var(--color-primary)" : "1px solid var(--color-beige-dark)" }}
                  >
                    <Image src={mainProductImage} alt={product.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  {gallery.map((img, i) => (
                    <div 
                      key={i} 
                      onMouseEnter={() => setActiveImage(img)}
                      className={`thumb-item ${activeImage === img ? "active" : ""}`}
                      style={{ position: "relative", aspectRatio: "1/1", borderRadius: "10px", overflow: "hidden", cursor: "pointer", border: activeImage === img ? "2px solid var(--color-primary)" : "1px solid var(--color-beige-dark)" }}
                    >
                      <Image src={img} alt={`${product.name} ${i}`} fill style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="detail-content">
              <h1 className="detail-title">{product.name}</h1>
              <div className="detail-pricing" style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
                <span className="price-current">{product.price}</span>
                {product.oldPrice && <span className="price-old">{product.oldPrice}</span>}
              </div>
              
              <div className="description-preview" style={{ padding: "25px 0", borderTop: "1px solid var(--color-beige-dark)", borderBottom: "1px solid var(--color-beige-dark)", marginBottom: "30px" }}>
                <p style={{ color: "var(--color-text-muted)", lineHeight: "1.8", margin: 0 }}>
                  {product.description}
                </p>
              </div>

              <div className="action-buttons" style={{ display: "flex", gap: "15px" }}>
                <button className="buy-now-btn">MUA NGAY</button>
                <button className="wishlist-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>

              {details?.specs && (
                <div className="specs-highlight">
                  <h4>Thông số nổi bật:</h4>
                  <p>{details.specs}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="product-details-tabs" style={{ padding: "60px 0", background: "var(--color-beige-light)" }}>
        <div className="container">
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                onClick={() => setActiveTab("details")}
                className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
              >
                CHI TIẾT SẢN PHẨM
              </button>
              <button 
                onClick={() => setActiveTab("usage")}
                className={`tab-btn ${activeTab === "usage" ? "active" : ""}`}
              >
                HƯỚNG DẪN SỬ DỤNG
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              >
                ĐÁNH GIÁ
              </button>
            </div>
            
            <div className="tab-content" style={{ padding: "40px 0" }}>
              {activeTab === "details" && (
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: details?.full_description || "<p>Nội dung đang được cập nhật...</p>" }} />
              )}
              {activeTab === "usage" && (
                <div className="usage-guide">
                  <h3>Hướng dẫn sử dụng</h3>
                  <p>Sản phẩm ứng dụng công nghệ hồng ngoại xa, mang lại lợi ích chăm sóc sức khỏe tối ưu khi sử dụng đúng cách.</p>
                  <ul>
                    <li>Làm sạch da trước khi sử dụng thiết bị.</li>
                    <li>Áp dụng nhẹ nhàng lên các vùng cơ thể cần massage hoặc sưởi ấm.</li>
                    <li>Sử dụng hàng ngày từ 15-30 phút để đạt hiệu quả tốt nhất.</li>
                    <li>Tránh tiếp xúc trực tiếp với nước đối với các bộ phận điện tử.</li>
                  </ul>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="reviews-section">
                  <h3>Đánh giá từ khách hàng</h3>
                  <div className="review-stat" style={{ marginBottom: "30px" }}>
                    <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary)" }}>5.0</span>
                    <span style={{ color: "gold", fontSize: "1.5rem", marginLeft: "10px" }}>★★★★★</span>
                    <p style={{ color: "var(--color-text-muted)" }}>Dựa trên 12 đánh giá thực tế</p>
                  </div>
                  <div className="review-list">
                    <div className="review-item" style={{ padding: "20px", background: "var(--color-beige-light)", borderRadius: "10px", marginBottom: "15px" }}>
                      <div style={{ fontWeight: 700, marginBottom: "5px" }}>Anh Hùng (Hà Nội)</div>
                      <div style={{ color: "gold", marginBottom: "10px" }}>★★★★★</div>
                      <p style={{ margin: 0 }}>Sản phẩm tuyệt vời, dùng rất thư giãn cơ bắp sau ngày làm việc mệt mỏi. Giao hàng rất nhanh.</p>
                    </div>
                    <div className="review-item" style={{ padding: "20px", background: "var(--color-beige-light)", borderRadius: "10px" }}>
                      <div style={{ fontWeight: 700, marginBottom: "5px" }}>Chị Mai (TP.HCM)</div>
                      <div style={{ color: "gold", marginBottom: "10px" }}>★★★★★</div>
                      <p style={{ margin: 0 }}>Màu sắc và thiết kế cực kỳ sang trọng, tặng người thân rất ý nghĩa. Hiệu quả làm ấm rõ rệt.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Slider */}
      <section className="related-products-slider" style={{ padding: "80px 0" }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "center", marginBottom: "50px" }}>Sản phẩm tương tự</h2>
          <Slider {...sliderSettings}>
            {relatedProducts.map((p, index) => (
              <div key={index} className="slider-item">
                <Link href={`/san-pham/${p.slug}`} className="slider-product-card">
                  <div className="slider-image-container">
                    <Image src={getHiRes(p.image_url)} alt={p.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="slider-overlay-content">
                    <h3 className="slider-product-name">{p.name}</h3>
                    <p className="slider-product-price">Giá: {p.price}</p>
                    <div className="slider-action-btn">XEM CHI TIẾT</div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
}
