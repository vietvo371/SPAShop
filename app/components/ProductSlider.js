"use client";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";
import productDetails from "@/data/product_details.json";

// Helper: lấy ảnh gốc từ gallery (ưu tiên JPG kích thước lớn)
const getHiResImage = (slug, fallbackUrl) => {
  const details = productDetails[slug];
  if (details?.gallery_images?.length > 0) {
    const jpgImg = details.gallery_images.find(img => img.match(/\.jpe?g$/i));
    if (jpgImg) return jpgImg;
    return details.gallery_images[0];
  }
  return fallbackUrl || "";
};

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
        <Slider {...settings}>
          {productsData.slice(0, 6).map((product, index) => {
            return (
              <div key={index} className="slider-item">
                <Link href={`/san-pham/${product.slug}`} className="slider-product-card">
                  <div className="slider-image-container">
                    <Image
                      src={getHiResImage(product.slug, product.image_url)}
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
          );
          })}
        </Slider>
      </div>
    </section>
  );
}

