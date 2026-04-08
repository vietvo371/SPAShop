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
      {/* Adaptive Header / Breadcrumb */}
      <section className="detail-hero" style={{ padding: "180px 0 30px", background: "var(--color-beige-light)" }}>
        <div className="container">
          <div className="breadcrumb-adaptive-wrapper">
            <nav aria-label="Breadcrumb" className="breadcrumb-nav">
              <ul className="breadcrumb-list">
                <li className="breadcrumb-item">
                  <Link href="/">Trang chủ</Link>
                </li>
                <li className="breadcrumb-separator">·</li>
                <li className="breadcrumb-item">
                  <Link href="/san-pham">Sản phẩm công nghệ</Link>
                </li>
                <li className="breadcrumb-separator">·</li>
                <li className="breadcrumb-item active">
                  <span>{product.name}</span>
                </li>
              </ul>
            </nav>
            <div className="breadcrumb-fade-indicator" />
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
