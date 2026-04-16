import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/app/components/ProductDetailClient";

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
      isActive: true
    },
    include: {
      category: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { orderIndex: "asc" }],
      },
      details: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Convert Decimal to number for serialization
  const sanitizedProduct = {
    ...product,
    price: Number(product.price)
  };

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      slug: { not: slug },
      isActive: true
    },
    take: 4,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1
      }
    }
  });

  // Transform for ProductDetailClient format and convert Decimal
  const sanitizedRelated = relatedProducts.map(p => ({
    ...p,
    price: Number(p.price),
    imageUrl: p.images[0]?.url || p.imageUrl || '/images/hero-banner.png'
  }));

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
        product={sanitizedProduct}
        details={product.details}
        relatedProducts={sanitizedRelated}
      />
    </div>
  );
}
