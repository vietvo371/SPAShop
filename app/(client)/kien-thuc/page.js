import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Kiến Thức Sức Khỏe - Tâm An Energy Healing",
  description: "Cập nhật kiến thức về công nghệ hồng ngoại xa (FIR), tips chăm sóc sức khỏe và bài viết hữu ích từ chuyên gia.",
};

import articles from "@/data/articles.json";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { MoveRight } from "lucide-react";

export default function KnowledgePage() {
  return (
    <div className="knowledge-page">
      <Header />

      <section className="blog-hero" style={{
        padding: "180px 0 80px",
        background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
        color: "white",
        textAlign: "center"
      }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 8vw, 4rem)",
            fontWeight: 800,
            fontFamily: "var(--font-heading)",
            lineHeight: 1.1,
            marginBottom: "20px"
          }}>Kiến Thức Sức Khỏe</h1>
          <p style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>Khám phá những bí quyết chăm sóc sức khỏe chủ động từ chuyên gia và công nghệ hồng ngoại xa đột phá.</p>
        </div>
      </section>

      <section className="blog-section" style={{ padding: "80px 0", background: "#fafafa" }}>
        <div className="container">
          <div className="blog-grid">
            {articles.map((article) => (
              <article key={article.slug} className="blog-card" style={{
                background: "white",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #f0f0f0",
                height: "100%"
              }}>
                <div className="blog-card-image" style={{ height: "240px", position: "relative" }}>
                  <Image
                    src={article.image || "/images/hero-banner.png"}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="blog-category-tag" style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    background: "var(--color-primary)",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: "50px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}>
                    {article.category}
                  </span>
                </div>
                <div className="blog-card-content" style={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <p className="blog-date" style={{ fontSize: "0.85rem", color: "#888", marginBottom: "12px" }}>
                    {article.date}
                  </p>
                  <h3 className="blog-title" style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    marginBottom: "15px",
                    lineHeight: 1.4,
                    color: "var(--color-dark)"
                  }}>
                    {article.title}
                  </h3>
                  <p className="blog-excerpt" style={{
                    fontSize: "0.95rem",
                    color: "#666",
                    marginBottom: "25px",
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/kien-thuc/${article.slug}`}
                    className="blog-read-more"
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--color-primary)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    Xem chi tiết <MoveRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
