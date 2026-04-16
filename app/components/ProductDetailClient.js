"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { formatPrice } from "../lib/utils";

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
  // Use images from relation or galleryImages from details
  const galleryUrls = product.images?.length > 0
    ? product.images.map(img => img.url)
    : (details?.galleryImages || []);

  // Priority for main image
  const mainProductImage = product.images?.find(img => img.isPrimary)?.url
    || galleryUrls[0]
    || product.imageUrl;

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

  const router = useRouter();
  const { addToCart, openCart, setBuyNow } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    openCart();
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    setBuyNow(product, 1);
    router.push("/gio-hang?mode=buy-now");
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
              {galleryUrls.length > 0 && (
                <div className="thumb-container">
                  <div className="thumb-scroll">
                    {galleryUrls.map((img, i) => (
                      <div
                        key={i}
                        onMouseEnter={() => setActiveImage(img)}
                        className={`thumb-item ${activeImage === img ? "active" : ""}`}
                        style={{
                          flex: "0 0 80px",
                          position: "relative",
                          aspectRatio: "1/1",
                          borderRadius: "10px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: activeImage === img ? "2px solid var(--color-primary)" : "1px solid var(--color-beige-dark)"
                        }}
                      >
                        <Image src={img} alt={`${product.name} ${i}`} fill style={{ objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>
              )
              }
            </div>

            {/* Right: Info */}
            <div className="detail-content">
              <h1 className="detail-title">{product.name}</h1>
              <div className="detail-pricing" style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
                <span className="price-current">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="price-old">{formatPrice(product.oldPrice)}</span>}
              </div>

              <div className="description-preview" style={{ padding: "25px 0", borderTop: "1px solid var(--color-beige-dark)", borderBottom: "1px solid var(--color-beige-dark)", marginBottom: "30px" }}>
                <p style={{ color: "var(--color-text-muted)", lineHeight: "1.8", margin: 0 }}>
                  {product.description}
                </p>
              </div>

              <div className="product-policies" style={{ marginBottom: "30px", padding: "15px", border: "1px dashed var(--color-beige-dark)", borderRadius: "10px", background: "#fffaf5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", fontSize: "0.9rem", color: "var(--color-primary)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"></path></svg>
                  <span>Đổi mới 1 đổi 1 trong 30 ngày (lỗi do nhà sản xuất)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "var(--color-primary)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"></path></svg>
                  <span>Bảo hành 1 năm chính hãng</span>
                </div>
              </div>

              <div className="action-buttons" style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
                {Number(product.price) > 0 ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="add-to-cart-btn"
                      style={{ flex: 1, padding: "18px", borderRadius: "50px", border: "2px solid var(--color-primary)", background: "transparent", color: "var(--color-primary)", fontWeight: 700, transition: "var(--transition)", cursor: "pointer" }}
                    >
                      THÊM VÀO GIỎ
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="order-now-btn"
                      style={{ flex: 1.5, padding: "18px", borderRadius: "50px", border: "none", background: "var(--color-primary)", color: "#fff", fontWeight: 700, transition: "var(--transition)", cursor: "pointer" }}
                    >
                      ĐẶT HÀNG NGAY
                    </button>
                  </>
                ) : (
                  <a
                    href="tel:0356308211"
                    className="contact-now-btn"
                    style={{
                      flex: 1,
                      padding: "18px",
                      borderRadius: "50px",
                      border: "none",
                      background: "var(--color-primary)",
                      color: "#fff",
                      fontWeight: 700,
                      textAlign: "center",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    LIÊN HỆ NGAY: 035 630 8211
                  </a>
                )}
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
            <div className="tabs-header" style={{ display: "flex", gap: "40px", borderBottom: "1px solid var(--color-beige-dark)" }}>
              <button
                onClick={() => setActiveTab("details")}
                className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
              >
                THÔNG TIN SẢN PHẨM
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`tab-btn ${activeTab === "specs" ? "active" : ""}`}
              >
                THÔNG SỐ KỸ THUẬT
              </button>
              <button
                onClick={() => setActiveTab("functions")}
                className={`tab-btn ${activeTab === "functions" ? "active" : ""}`}
              >
                CHỨC NĂNG
              </button>
            </div>

            <div className="tab-content" style={{ padding: "40px 0" }}>
              {activeTab === "details" && (
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: details?.fullDescHtml || "<p>Nội dung đang được cập nhật...</p>" }} />
              )}
              {activeTab === "specs" && (
                <div className="specs-detailed">
                  <h3 style={{ marginBottom: "25px" }}>Thông số kỹ thuật chi tiết</h3>
                  {details?.specsDetailed && Object.keys(details.specsDetailed).length > 0 ? (
                    <div style={{ display: "grid", gap: "15px" }}>
                      {Object.entries(details.specsDetailed).map(([key, value]) => (
                        <div key={key} style={{ display: "grid", gridTemplateColumns: "200px 1fr", padding: "15px 0", borderBottom: "1px solid var(--color-beige-dark)" }}>
                          <span style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{product.specs || "Đang cập nhật..."}</p>
                  )}
                </div>
              )}
              {activeTab === "functions" && (
                <div className="functions-content">
                  {details?.functionsHtml ? (
                    <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: details.functionsHtml }} />
                  ) : (
                    <div className="rich-text-content">
                      <h3>Công Nghệ Nano Bán Dẫn</h3>
                      <p>Sản phẩm ứng dụng màng nhiệt Nano bán dẫn phát tia hồng ngoại xa (FIR) với bước sóng 8-14 micromet, thẩm thấu sâu và kích hoạt tế bào mạnh mẽ.</p>
                      <p>Nội dung chi tiết về chức năng đang được cập nhật...</p>
                    </div>
                  )}
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
                    <Image src={p.primaryImage || p.imageUrl} alt={p.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="slider-overlay-content">
                    <h3 className="slider-product-name">{p.name}</h3>
                    <p className="slider-product-price">Giá: {formatPrice(p.price)}</p>
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
