import Image from "next/image";
import Link from "next/link";
import productsData from "@/data/products.json";
import productDetails from "@/data/product_details.json";

// Helper: lấy ảnh gốc từ gallery (thường là JPG kích thước lớn)
const getMainImage = (slug) => {
  const details = productDetails[slug];
  if (details?.gallery_images?.length > 0) {
    const jpgImg = details.gallery_images.find(img => img.match(/\.jpe?g$/i));
    if (jpgImg) return jpgImg;
    return details.gallery_images[0];
  }
  return productsData.find(p => p.slug === slug)?.image_url || "";
};

export const metadata = {
  title: "Sản phẩm công nghệ - Chân An Hồng Ngoại Xa FIR",
  description: "Khám phá danh mục sản phẩm công nghệ hồng ngoại xa (FIR) ứng dụng nano bán dẫn từ Đài Loan chính hãng tại Chân An.",
};

const categories = [
  { id: "all", name: "Tất cả sản phẩm" },
  { id: "electric", name: "Máy hồng ngoại xa có điện" },
  { id: "non-electric", name: "Thiết bị FIR không dùng điện" },
  { id: "jewelry", name: "Trang sức hồng ngoại xa" },
];

export default function ProductsPage() {
  return (
    <>
      <section className="page-hero" style={{ padding: "120px 0 60px", background: "var(--color-beige-light)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", marginBottom: "15px", color: "var(--color-primary)" }}>Sản Phẩm Công Nghệ</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
            Hệ sinh thái sản phẩm hồng ngoại xa (FIR) ứng dụng công nghệ nano tiên tiến, mang lại giải pháp chăm sóc sức khỏe toàn diện.
          </p>
        </div>
      </section>

      <section className="page-content" style={{ padding: "60px 0 100px", background: "#fff" }}>
        <div className="container">
          {/* Category filters */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button key={cat.id} style={{
                padding: "10px 24px",
                borderRadius: "50px",
                border: "1px solid var(--color-beige-dark)",
                background: cat.id === "all" ? "var(--color-primary)" : "var(--color-beige-light)",
                color: cat.id === "all" ? "var(--color-white)" : "var(--color-text-main)",
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
            {productsData.map((product, index) => (
              <Link href={`/san-pham/${product.slug}`} key={index} className="product-card">
                <div className="product-image-wrapper">
                  <Image
                    src={getMainImage(product.slug)}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 480px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                  {/* Badge example - could be logic-based later */}
                  {index < 3 && <span className="product-badge">Bán chạy</span>}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <p className="product-price">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
