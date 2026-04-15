"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
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

export default function ProductSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=6&isFeatured=true");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching slider products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
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
    <section className="products-section" id="products">
      <div className="container">
        <h2 className="section-title">Sản Phẩm Công Nghệ</h2>
        <p className="section-subtitle">
          Công nghệ Hồng ngoại xa (FIR) hàng đầu — Khỏe mạnh từ bên trong
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Đang tải sản phẩm...</div>
        ) : products.length > 0 ? (
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="slider-item">
                <Link href={`/san-pham/${product.slug}`} className="slider-product-card">
                  <div className="slider-image-container">
                    <Image
                      src={product.primaryImage || product.imageUrl}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="slider-overlay-content">
                    <h3 className="slider-product-name">{product.name}</h3>
                    <p className="slider-product-price">Giá: {product.price}</p>
                    <div className="slider-action-btn">XEM CHI TIẾT</div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <div style={{ textAlign: "center", padding: "40px" }}>Không có sản phẩm nổi bật nào.</div>
        )}
      </div>
    </section>
  );
}
