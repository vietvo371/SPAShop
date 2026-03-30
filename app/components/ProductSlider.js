"use client";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Đèn Hồng Ngoại Xa FIR Pro Max",
    price: "3.500.000₫",
    oldPrice: "4.200.000₫",
    image: "/images/product-fir-device.png",
    badge: "-17%",
  },
  {
    id: 2,
    name: "Thảm Đá Ngọc Hồng Ngoại Xa Premium",
    price: "5.800.000₫",
    oldPrice: "7.000.000₫",
    image: "/images/product-fir-mat.png",
    badge: "-17%",
  },
  {
    id: 3,
    name: "Vòng Tay Hồng Ngoại Xa Energy",
    price: "1.200.000₫",
    oldPrice: "1.500.000₫",
    image: "/images/product-fir-jewelry.png",
    badge: "-20%",
  },
  {
    id: 4,
    name: "Đai Lưng Hồng Ngoại Xa Tâm An",
    price: "2.800.000₫",
    oldPrice: "3.500.000₫",
    image: "/images/product-fir-mat.png",
    badge: "-20%",
  },
  {
    id: 5,
    name: "Đèn Hồng Ngoại Mini Gia Đình",
    price: "1.900.000₫",
    oldPrice: "2.400.000₫",
    image: "/images/product-fir-device.png",
    badge: "-21%",
  },
  {
    id: 6,
    name: "Bộ Trang Sức FIR Cao Cấp",
    price: "2.500.000₫",
    oldPrice: "3.200.000₫",
    image: "/images/product-fir-jewelry.png",
    badge: "-22%",
  },
];

export default function ProductSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 968,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="products-section" id="products">
      <div className="container">
        <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        <p className="section-subtitle">
          Công nghệ Hồng ngoại xa (FIR) hàng đầu — Được tin dùng bởi hàng nghìn khách hàng
        </p>
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id}>
              <div className="product-card">
                <div className="product-image-wrapper">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 600px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    {product.price}
                    {product.oldPrice && (
                      <span className="product-price-old">{product.oldPrice}</span>
                    )}
                  </p>
                  <Link href="/san-pham" className="product-btn">
                    XEM CHI TIẾT
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
