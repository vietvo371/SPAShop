"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../product-form";
import styles from "../../admin.module.css";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const result = await response.json();

        if (result.success) {
          setProduct(result.data);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Có lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
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

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className={styles.alertError}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <a href="/admin/products" className={styles.breadcrumbLink}>Sản phẩm</a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>{product?.name}</span>
        </div>
        <h1 className={styles.pageTitle}>Chỉnh sửa sản phẩm</h1>
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
      <ProductForm product={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
