import Link from "next/link";
import ImageWithSkeleton from "@/app/components/ImageWithSkeleton";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";
import styles from "./knowledge-detail.module.css";
import { Calendar, Eye, Share2, ArrowLeft } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let article = await prisma.article.findUnique({
    where: { slug }
  });

  if (!article) {
    const staticArticle = articles.find((a) => a.slug === slug);
    if (staticArticle) {
      article = {
        title: staticArticle.title,
        excerpt: staticArticle.excerpt,
        imageUrl: staticArticle.image,
      };
    }
  }

  if (!article) {
    return { title: "Bài viết không tìm thấy" };
  }

  return {
    title: `${article.title} - Tâm An Energy Healing`,
    description: article.excerpt || "",
    openGraph: {
      title: article.title,
      description: article.excerpt || "",
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  
  // 1. Try to find this specific article in DB first (regardless of status, so drafts are viewable too!)
  let dbArticle = await prisma.article.findUnique({
    where: { slug }
  });
  
  let article = null;
  if (dbArticle) {
    article = {
      title: dbArticle.title,
      slug: dbArticle.slug,
      category: dbArticle.category || "Chưa phân loại",
      image: dbArticle.imageUrl || "/images/hero-banner.png",
      date: new Date(dbArticle.createdAt).toLocaleDateString("vi-VN"),
      content: dbArticle.contentHtml || "",
      excerpt: dbArticle.excerpt || "",
      viewCount: dbArticle.viewCount || 0,
    };
  } else {
    // Check static JSON
    const staticArticle = articles.find((a) => a.slug === slug);
    if (staticArticle) {
      article = {
        title: staticArticle.title,
        slug: staticArticle.slug,
        category: staticArticle.category,
        image: staticArticle.image,
        date: staticArticle.date,
        content: staticArticle.content,
        excerpt: staticArticle.excerpt,
        viewCount: staticArticle.viewCount || 0,
      };
    }
  }

  if (!article) {
    notFound();
  }

  // 2. Fetch published articles for related sidebar items
  const dbRelated = await prisma.article.findMany({
    where: { 
      status: "PUBLISHED",
      slug: { not: slug }
    },
    take: 3
  });

  const formattedDbRelated = dbRelated.map(a => ({
    title: a.title,
    slug: a.slug,
    category: a.category || "Chưa phân loại",
    image: a.imageUrl || "/images/hero-banner.png",
    date: new Date(a.createdAt).toLocaleDateString("vi-VN"),
    excerpt: a.excerpt || "",
  }));

  const staticRelated = articles
    .filter((a) => a.slug !== slug)
    .map(a => ({
      title: a.title,
      slug: a.slug,
      category: a.category,
      image: a.image,
      date: a.date,
      excerpt: a.excerpt,
    }));

  const relatedArticles = [...formattedDbRelated, ...staticRelated]
    .filter(a => a.category === article.category)
    .slice(0, 3);

  if (relatedArticles.length < 3) {
    const moreRelated = [...formattedDbRelated, ...staticRelated]
      .filter(a => !relatedArticles.find(r => r.slug === a.slug))
      .slice(0, 3 - relatedArticles.length);
    relatedArticles.push(...moreRelated);
  }

  return (
    <div className={styles.articlePage}>

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
          <ImageWithSkeleton
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
                    <ImageWithSkeleton
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


    </div>
  );
}