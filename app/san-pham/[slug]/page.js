import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import products from "@/data/products.json";
import productDetails from "@/data/product_details.json";
import ProductDetailClient from "@/app/components/ProductDetailClient";

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

  // Related products (random 5)
  const relatedProducts = products
    .filter((p) => p.slug !== slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

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

      <ProductDetailClient 
        product={product} 
        details={details} 
        relatedProducts={relatedProducts} 
      />
    </div>
  );
}
