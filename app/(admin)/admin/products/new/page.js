"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../product-form";
import styles from "../../admin.module.css";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/admin/products");
      } else {
        setError(result.error || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <a href="/admin/products" className={styles.breadcrumbLink}>Sản phẩm</a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>Thêm mới</span>
        </div>
        <h1 className={styles.pageTitle}>Thêm sản phẩm mới</h1>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.alertError}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
