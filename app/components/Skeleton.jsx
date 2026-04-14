"use client";
import styles from "./Skeleton.module.css";

export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={styles.title} />
        <div className={styles.price} />
        <div className={styles.button} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className={styles.productGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className={styles.serviceCard}>
      <div className={styles.icon} />
      <div className={styles.title} />
      <div className={styles.desc} />
      <div className={styles.descShort} />
    </div>
  );
}

export function ServiceGridSkeleton({ count = 6 }) {
  return (
    <div className={styles.serviceGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroTitle} />
        <div className={styles.heroSubtitle} />
        <div className={styles.heroButton} />
      </div>
      <div className={styles.heroImage} />
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className={styles.articleCard}>
      <div className={styles.articleImage} />
      <div className={styles.articleContent}>
        <div className={styles.articleCategory} />
        <div className={styles.articleTitle} />
        <div className={styles.articleExcerpt} />
      </div>
    </div>
  );
}

export default function PageSkeleton() {
  return (
    <div className={styles.page}>
      <HeroSkeleton />
      <div className={styles.section}>
        <ProductGridSkeleton count={4} />
      </div>
      <div className={styles.section}>
        <ServiceGridSkeleton count={3} />
      </div>
    </div>
  );
}