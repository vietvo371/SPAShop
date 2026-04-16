import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";
import styles from "./knowledge-detail.module.css";
import { Calendar, Eye, Share2, ArrowLeft } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

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

  const relatedArticles = articles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  if (relatedArticles.length < 3) {
    const moreArticles = articles
      .filter((a) => a.slug !== slug && !relatedArticles.find(r => r.slug === a.slug))
      .slice(0, 3 - relatedArticles.length);
    relatedArticles.push(...moreArticles);
  }

  return (
    <div className={styles.articlePage}>
      <Header />

      {/* Breadcrumb Section */}
      <section className={styles.breadcrumbSection}>
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
                <span>Chi tiết bài viết</span>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <header className={styles.articleHeader}>
        <div className="container">
          <span className={styles.categoryTag}>{article.category}</span>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={18} />
              <span>{article.date}</span>
            </div>
            <div className={styles.metaItem}>
              <Eye size={18} />
              <span>{article.viewCount || 0} lượt xem</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="container">
        <div className={styles.heroImageContainer}>
          <Image
            src={article.image || "/images/hero-banner.png"}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>
      </div>

      {/* Article Content */}
      <article className={styles.contentWrapper}>
        <div className={`${styles.richText} rich-text-content`}>
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <>
              <p style={{ fontSize: "1.25rem", fontWeight: 500, color: "var(--color-dark)", marginBottom: "30px" }}>
                {article.excerpt}
              </p>
              <p>Nội dung chi tiết của bài viết đang được cập nhật...</p>
            </>
          )}
        </div>

        {/* Share Section */}
        <section className={styles.shareSection}>
          <h3 className={styles.shareTitle}>
            <Share2 size={20} style={{ display: "inline", marginRight: "10px", verticalAlign: "middle" }} />
            Chia sẻ kiến thức bổ ích này
          </h3>
          <div className={styles.shareButtons}>
            <a href="#" className={`${styles.shareBtn} ${styles.fbBtn}`}>Facebook</a>
            <a href="#" className={`${styles.shareBtn} ${styles.zaloBtn}`}>Zalo</a>
          </div>
        </section>

        {/* Back Link */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link href="/kien-thuc" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
            <ArrowLeft size={18} /> Quay lại danh sách bài viết
          </Link>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className={styles.relatedSection}>
          <div className="container">
            <h2 className={styles.relatedTitle}>Kiến Thức Bạn Sẽ Quan Tâm</h2>
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
                    <span className="blog-category-tag">{a.category}</span>
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
                      Chi tiết <ArrowLeft size={14} style={{ transform: "rotate(180deg)" }} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}