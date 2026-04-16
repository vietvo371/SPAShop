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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

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

        // Fetch products with pagination
        const url = activeCategory === "all"
          ? `/api/products?page=${page}&limit=${limit}`
          : `/api/products?categoryId=${activeCategory}&page=${page}&limit=${limit}`;

        const prodRes = await fetch(url);
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.data);
          setTotalPages(prodData.pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, page]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setPage(1);
  };

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

      <section className="page-content" style={{ padding: "40px 0 100px", background: "#fff" }}>
        <div className="container">
          {/* Category filters with horizontal scroll */}
          <div className="category-scroll-wrapper" style={{
            marginBottom: "40px",
            position: "relative"
          }}>
            <div style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "10px",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              justifyContent: "flex-start"
            }} className="no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
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
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "20px", color: "var(--color-text-muted)" }}>Đang tải sản phẩm...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-page-grid">
                {products.map((product) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "60px",
                  alignItems: "center"
                }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-beige-dark)",
                      background: "white",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      opacity: page === 1 ? 0.5 : 1,
                      fontSize: "0.9rem",
                      fontWeight: 600
                    }}
                  >
                    Trước
                  </button>

                  <div style={{ display: "flex", gap: "5px" }}>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          border: "1px solid var(--color-beige-dark)",
                          background: page === i + 1 ? "var(--color-primary)" : "white",
                          color: page === i + 1 ? "white" : "var(--color-text-main)",
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-beige-dark)",
                      background: "white",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      opacity: page === totalPages ? 0.5 : 1,
                      fontSize: "0.9rem",
                      fontWeight: 600
                    }}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>📦</div>
              <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem" }}>Không tìm thấy sản phẩm nào trong danh mục này.</p>
              <button
                onClick={() => handleCategoryChange("all")}
                style={{
                  marginTop: "20px",
                  padding: "12px 30px",
                  background: "var(--color-primary)",
                  color: "white",
                  borderRadius: "50px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(104, 10, 178, 0.1);
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
