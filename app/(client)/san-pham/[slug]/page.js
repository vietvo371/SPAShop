import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/app/components/ProductDetailClient";

// Fetch data from internal API for SSR/SSG
async function getProductData(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/slug/${slug}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

async function getRelatedProducts(excludeSlug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?limit=5`, {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data.filter(p => p.slug !== excludeSlug);
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?limit=1000`);
    const data = await res.json();
    if (!data.success) return [];
    return data.data.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const productData = await getProductData(slug);

  if (!productData || !productData.success) {
    notFound();
  }

  const product = productData.data;
  const relatedProducts = await getRelatedProducts(slug);

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
        details={product.details}
        relatedProducts={relatedProducts}
      />
    </div>
  );
}
