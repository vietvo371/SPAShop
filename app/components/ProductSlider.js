"use client";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Cây Trâm Ánh Sáng Sinh Học Hồng Ngoại Xa",
    price: "3.800.000đ",
    image: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-095708-5542.png",
    link: "/san-pham/cay-tram-anh-sang-sinh-hoc-hong-ngoai-xa"
  },
  {
    id: 2,
    name: "Mặt Gốm Ánh Sáng Sinh Học Hồng Ngoại Xa",
    price: "2.600.000đ",
    image: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-100131-7118.png",
    link: "/san-pham/mat-gom-anh-sang-sinh-hoc-hong-ngoai-xa"
  },
  {
    id: 3,
    name: "Máy Nén Nhiệt Ánh Sáng Sinh Học Hồng Ngoại Xa",
    price: "7.800.000đ",
    image: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102941-9735.png",
    link: "/san-pham/may-nen-nhiet-anh-sang-sinh-hoc-hong-ngoai-xa"
  },
  {
    id: 4,
    name: "Đai Mắt Nhiệt Ánh Sáng Sinh Học Hồng Ngoại Xa",
    price: "5.800.000đ",
    image: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-102105-4919.png",
    link: "/san-pham/dai-mat-nhiet-anh-sang-sinh-hoc-hong-ngoai-xa"
  },
  {
    id: 5,
    name: "Máy Quạt Sưởi Ánh Sáng Sinh Học Hồng Ngoại Xa",
    price: "23.800.000đ",
    image: "https://www.chanan.vn/upload/product/z7364053668905aff9f9f272b65c724ce9e7f00cf34068-2991.jpg",
    link: "/san-pham/may-quat-suoi-hong-ngoai-xa"
  },
  {
    id: 6,
    name: "Thước Massage Ánh Sáng Sinh Học Hồng Ngoại Xa",
    price: "8.000.000đ",
    image: "https://www.chanan.vn/upload/product/screenshot-2026-02-22-at-101752-7130.png",
    link: "/san-pham/thuoc-massage-anh-sang-sinh-hoc-hong-ngoai-xa"
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
          {products.map((product) => (
            <div key={product.id}>
              <div className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                  <div className="product-overlay"></div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Giá: {product.price}</p>
                  <Link href={product.link} className="product-btn">
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

