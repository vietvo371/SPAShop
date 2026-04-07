import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "@/data/products.json";
import productDetails from "@/data/product_details.json";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  const details = productDetails[slug];

  if (!product) {
    notFound();
  }

  // Related products (random 3)
  const relatedProducts = products
    .filter((p) => p.slug !== slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="product-detail-page" style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Banner / Header */}
      <section className="detail-hero" style={{ padding: "120px 0 40px", background: "var(--color-beige-light)" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "8px", fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "20px" }}>
            <Link href="/" style={{ hover: { color: "var(--color-primary)" } }}>Trang chủ</Link>
            <span>/</span>
            <Link href="/san-pham">Sản phẩm công nghệ</Link>
            <span>/</span>
            <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>{product.name}</span>
          </div>
        </div>
      </section>

      <section className="product-main-info" style={{ padding: "40px 0" }}>
        <div className="container">
          <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
            {/* Left: Project Images */}
            <div className="detail-gallery">
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "20px", overflow: "hidden", marginBottom: "20px", border: "1px solid var(--color-beige-dark)" }}>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              {details?.gallery_images && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {details.gallery_images.map((img, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--color-beige-dark)", cursor: "pointer" }}>
                      <Image src={img} alt={`${product.name} gallery ${i}`} fill style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Basic Info */}
            <div className="detail-content">
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", marginBottom: "15px", color: "#000", lineHeight: "1.2" }}>{product.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#8b3d2b" }}>{product.price}</span>
                {product.oldPrice && (
                  <span style={{ fontSize: "1.2rem", color: "var(--color-text-muted)", textDecoration: "line-through" }}>{product.oldPrice}</span>
                )}
              </div>
              
              <div style={{ padding: "25px 0", borderTop: "1px solid var(--color-beige-dark)", borderBottom: "1px solid var(--color-beige-dark)", marginBottom: "30px" }}>
                <p style={{ color: "var(--color-text-muted)", lineHeight: "1.8", marginBottom: "0" }}>
                  {product.description}
                </p>
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <button style={{ flex: 1, padding: "18px", borderRadius: "50px", background: "var(--color-primary)", color: "#fff", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", transition: "var(--transition)" }}>
                  MUA NGAY
                </button>
                <button style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--color-beige-light)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--color-beige-dark)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>

              {details?.specs && (
                <div style={{ marginTop: "40px", padding: "20px", background: "var(--color-beige-light)", borderRadius: "15px" }}>
                  <h4 style={{ marginBottom: "10px", fontWeight: 700 }}>Thông số nổi bật:</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", margin: 0 }}>{details.specs}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs / Detailed Content */}
      <section className="product-details-tabs" style={{ padding: "60px 0", background: "var(--color-beige-light)" }}>
        <div className="container">
          <div style={{ background: "#fff", borderRadius: "30px", padding: "50px", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ display: "flex", gap: "40px", borderBottom: "1px solid var(--color-beige-dark)", marginBottom: "40px" }}>
              <button style={{ paddingBottom: "15px", fontWeight: 700, color: "var(--color-primary)", borderBottom: "3px solid var(--color-primary)" }}>CHI TIẾT SẢN PHẨM</button>
              <button style={{ paddingBottom: "15px", fontWeight: 600, color: "var(--color-text-muted)" }}>HƯỚNG DẪN SỬ DỤNG</button>
              <button style={{ paddingBottom: "15px", fontWeight: 600, color: "var(--color-text-muted)" }}>ĐÁNH GIÁ</button>
            </div>
            
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: details?.full_description || "<p>Nội dung đang được cập nhật...</p>" }} />
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="related-products" style={{ padding: "80px 0" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", marginBottom: "40px", textAlign: "center" }}>Sản phẩm tương tự</h2>
          <div className="products-page-grid">
            {relatedProducts.map((p, index) => (
              <Link href={`/san-pham/${p.slug}`} key={index} className="product-card">
                <div className="product-image-wrapper">
                  <Image src={p.image_url} alt={p.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-desc">{p.description}</p>
                  <p className="product-price">{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
