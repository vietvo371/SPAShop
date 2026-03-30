import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sản Phẩm Công Nghệ FIR - Tâm An Energy Healing",
  description: "Mua sắm các sản phẩm hồng ngoại xa (FIR) chính hãng: Đèn hồng ngoại, thảm đá ngọc, trang sức năng lượng.",
};

const categories = [
  { id: "all", name: "Tất cả sản phẩm" },
  { id: "electric", name: "Máy hồng ngoại xa có điện" },
  { id: "non-electric", name: "Thiết bị FIR không dùng điện" },
  { id: "jewelry", name: "Trang sức hồng ngoại xa" },
];

const products = [
  { id: 1, name: "Đèn Hồng Ngoại Xa FIR Pro Max", price: "3.500.000₫", oldPrice: "4.200.000₫", image: "/images/product-fir-device.png", badge: "-17%", category: "electric" },
  { id: 2, name: "Thảm Đá Ngọc Hồng Ngoại Xa Premium", price: "5.800.000₫", oldPrice: "7.000.000₫", image: "/images/product-fir-mat.png", badge: "-17%", category: "non-electric" },
  { id: 3, name: "Vòng Tay Hồng Ngoại Xa Energy", price: "1.200.000₫", oldPrice: "1.500.000₫", image: "/images/product-fir-jewelry.png", badge: "-20%", category: "jewelry" },
  { id: 4, name: "Đai Lưng Hồng Ngoại Xa Tâm An", price: "2.800.000₫", oldPrice: "3.500.000₫", image: "/images/product-fir-mat.png", badge: "-20%", category: "non-electric" },
  { id: 5, name: "Đèn Hồng Ngoại Mini Gia Đình", price: "1.900.000₫", oldPrice: "2.400.000₫", image: "/images/product-fir-device.png", badge: "-21%", category: "electric" },
  { id: 6, name: "Bộ Trang Sức FIR Cao Cấp", price: "2.500.000₫", oldPrice: "3.200.000₫", image: "/images/product-fir-jewelry.png", badge: "-22%", category: "jewelry" },
  { id: 7, name: "Gối Hồng Ngoại Xa Massage", price: "1.600.000₫", oldPrice: "2.000.000₫", image: "/images/product-fir-mat.png", badge: "-20%", category: "non-electric" },
  { id: 8, name: "Đèn Hồng Ngoại Xa Cầm Tay", price: "2.200.000₫", oldPrice: "2.800.000₫", image: "/images/product-fir-device.png", badge: "-21%", category: "electric" },
  { id: 9, name: "Nhẫn Hồng Ngoại Xa Titanium", price: "900.000₫", oldPrice: "1.200.000₫", image: "/images/product-fir-jewelry.png", badge: "-25%", category: "jewelry" },
];

export default function ProductsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Sản Phẩm Công Nghệ</h1>
          <p>Công nghệ Hồng ngoại xa (FIR) chính hãng — Chất lượng cao</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          {/* Category filters */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button key={cat.id} style={{
                padding: "10px 24px",
                borderRadius: "50px",
                border: "2px solid var(--color-primary)",
                background: cat.id === "all" ? "var(--color-primary)" : "transparent",
                color: cat.id === "all" ? "var(--color-white)" : "var(--color-primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "var(--transition)",
              }}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products grid */}
          <div className="products-page-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card" style={{ margin: 0 }}>
                <div className="product-image-wrapper">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 480px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    {product.price}
                    {product.oldPrice && <span className="product-price-old">{product.oldPrice}</span>}
                  </p>
                  <button className="product-btn">XEM CHI TIẾT</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
