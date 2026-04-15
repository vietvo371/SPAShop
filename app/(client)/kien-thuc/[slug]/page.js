import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  
  if (!article) {
    return { title: "Bài viết không tìm thấy" };
  }

  return {
    title: `${article.title} - Tâm An Energy Healing`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles (same category, different slug)
  const relatedArticles = articles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  // If not enough related, get any articles
  if (relatedArticles.length < 3) {
    const moreArticles = articles
      .filter((a) => a.slug !== slug && !relatedArticles.find(r => r.slug === a.slug))
      .slice(0, 3 - relatedArticles.length);
    relatedArticles.push(...moreArticles);
  }

  return (
    <div className="article-detail-page">
      {/* Breadcrumb */}
      <section style={{ padding: "160px 0 30px", background: "var(--color-beige-light)" }}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link href="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-separator">·</li>
              <li className="breadcrumb-item">
                <Link href="/kien-thuc">Kiến thức</Link>
              </li>
              <li className="breadcrumb-separator">·</li>
              <li className="breadcrumb-item active">
                <span>{article.title}</span>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <section style={{ padding: "40px 0", background: "white" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <span style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "var(--color-primary)",
            color: "white",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "16px"
          }}>
            {article.category}
          </span>
          
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            fontFamily: "var(--font-heading)",
            color: "var(--color-dark)", 
            marginBottom: "16px",
            lineHeight: 1.3
          }}>
            {article.title}
          </h1>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
            marginBottom: "30px"
          }}>
            <span>📅 {article.date}</span>
            <span>👁️ {article.viewCount || 0} lượt xem</span>
          </div>

          {article.image && (
            <div style={{ 
              position: "relative", 
              height: "400px", 
              borderRadius: "var(--radius-md)", 
              overflow: "hidden",
              marginBottom: "40px"
            }}>
              <Image
                src={article.image}
                alt={article.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="article-content rich-text-content" style={{ lineHeight: 1.8 }}>
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <>
                <p style={{ fontSize: "1.1rem", color: "var(--color-text-main)", marginBottom: "20px" }}>
                  {article.excerpt}
                </p>
                <p style={{ color: "var(--color-text-muted)" }}>
                  Nội dung chi tiết đang được cập nhật. Vui lòng quay lại sau hoặc liên hệ với chúng tôi để biết thêm thông tin.
                </p>
              </>
            )}
          </div>

          {/* Share Section */}
          <div style={{
            marginTop: "50px",
            padding: "24px",
            background: "var(--color-cream)",
            borderRadius: "var(--radius-md)",
            textAlign: "center"
          }}>
            <p style={{ 
              fontWeight: 600, 
              marginBottom: "16px",
              color: "var(--color-dark)"
            }}>
              Chia sẻ bài viết này
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style={{
                   padding: "10px 24px",
                   background: "#1877f2",
                   color: "white",
                   borderRadius: "var(--radius-sm)",
                   fontSize: "0.85rem",
                   fontWeight: 600,
                   textDecoration: "none"
                 }}>
                Facebook
              </a>
              <a href={`https://zalo.me/share`}
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{
                   padding: "10px 24px",
                   background: "#0068ff",
                   color: "white",
                   borderRadius: "var(--radius-sm)",
                   fontSize: "0.85rem",
                   fontWeight: 600,
                   textDecoration: "none"
                 }}>
                Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section style={{ padding: "80px 0", background: "var(--color-beige-light)" }}>
          <div className="container">
            <h2 style={{ 
              fontSize: "2rem", 
              fontWeight: 800, 
              fontFamily: "var(--font-heading)",
              color: "var(--color-primary)", 
              textAlign: "center",
              marginBottom: "50px"
            }}>
              Bài Viết Liên Quan
            </h2>

            <div className="blog-grid">
              {relatedArticles.map((a) => (
                <article key={a.slug} className="blog-card">
                  <div className="blog-card-image">
                    <Image
                      src={a.image || "/images/hero-banner.png"}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="blog-category-tag">
                      {a.category}
                    </span>
                  </div>
                  <div className="blog-card-content">
                    <p className="blog-date">{a.date}</p>
                    <h3 className="blog-title">
                      <Link href={`/kien-thuc/${a.slug}`} style={{ color: "inherit" }}>
                        {a.title}
                      </Link>
                    </h3>
                    <p className="blog-excerpt">{a.excerpt}</p>
                    <Link href={`/kien-thuc/${a.slug}`} className="blog-read-more">
                      Đọc thêm &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}