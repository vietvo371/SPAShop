"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/app/lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: "all", name: "Tất cả sản phẩm" },
  ]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (catData.success) {
          setCategories([
            { id: "all", name: "Tất cả sản phẩm" },
            ...catData.data.map(c => ({ id: c.id, name: c.name }))
          ]);
        }

        // Fetch products
        const url = activeCategory === "all"
          ? "/api/products?limit=100"
          : `/api/products?categoryId=${activeCategory}&limit=100`;

        const prodRes = await fetch(url);
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);

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
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "10px 24px",
                  borderRadius: "50px",
                  border: "1px solid var(--color-beige-dark)",
                  background: cat.id === activeCategory ? "var(--color-primary)" : "var(--color-beige-light)",
                  color: cat.id === activeCategory ? "var(--color-white)" : "var(--color-text-main)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Đang tải sản phẩm...</div>
          ) : products.length > 0 ? (
            <div className="products-page-grid">
              {products.map((product, index) => (
                <Link href={`/san-pham/${product.slug}`} key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    <Image
                      src={product.primaryImage || product.imageUrl}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 480px) 100vw, (max-width: 968px) 50vw, 33vw"
                    />
                    {product.isFeatured && <span className="product-badge">Bán chạy</span>}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <p className="product-price">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>Không có sản phẩm nào.</div>
          )}
        </div>
      </section>
    </>
  );
}
