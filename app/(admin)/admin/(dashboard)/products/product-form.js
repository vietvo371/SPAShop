"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./product-form.module.css";

export default function ProductForm({ product, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    description: "",
    specs: "",
    imageUrl: "",
    categoryId: "",
    isFeatured: false,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        price: product.price || "",
        description: product.description || "",
        specs: product.specs || "",
        imageUrl: product.imageUrl || "",
        categoryId: product.categoryId || "",
        isFeatured: product.isFeatured || false,
      });
    }
  }, [product]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-generate slug from name
    if (name === "name" && !product) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, (m) => (m === "Đ" ? "d" : "d"))
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageUrl: "Vui lòng chọn file hình ảnh" }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: "Kích thước file không được vượt quá 5MB" }));
      return;
    }

    setUploading(true);
    setErrors((prev) => ({ ...prev, imageUrl: null }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "products");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, imageUrl: result.url }));
      } else {
        setErrors((prev) => ({ ...prev, imageUrl: result.error || "Upload thất bại" }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrors((prev) => ({ ...prev, imageUrl: "Lỗi khi upload hình ảnh" }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm không được trống";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug không được trống";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug chỉ chứa chữ thường, số và dấu gạch ngang";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Giá không được trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.productForm}>
      <div className={styles.formGrid}>
        {/* Left Column */}
        <div className={styles.formColumn}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tên sản phẩm <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm"
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Slug <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="slug-san-pham"
                className={`${styles.input} ${errors.slug ? styles.inputError : ""}`}
              />
              <span className={styles.hint}>URL thân thiện: /san-pham/{formData.slug || "..."}</span>
              {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giá <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1.000.000₫"
                className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
              />
              {errors.price && <span className={styles.errorText}>{errors.price}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Danh mục</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>Hiển thị ở sản phẩm nổi bật</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.formColumn}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Hình ảnh</h3>

            <div className={styles.imageUploadArea}>
              {formData.imageUrl ? (
                <div className={styles.imagePreview}>
                  <img src={formData.imageUrl} alt="Preview" className={styles.previewImage} />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                    className={styles.removeImageBtn}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <label className={styles.uploadLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                    disabled={uploading}
                  />
                  <div className={styles.uploadContent}>
                    {uploading ? (
                      <>
                        <div className={styles.uploadSpinner}></div>
                        <span>Đang upload...</span>
                      </>
                    ) : (
                      <>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                        </svg>
                        <span>Kéo thả hình ảnh hoặc click để chọn</span>
                        <span className={styles.uploadHint}>PNG, JPG, GIF (tối đa 5MB)</span>
                      </>
                    )}
                  </div>
                </label>
              )}
              {errors.imageUrl && <span className={styles.errorText}>{errors.imageUrl}</span>}
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Mô tả</h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mô tả ngắn</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn về sản phẩm..."
                rows={4}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Thông số kỹ thuật</label>
              <textarea
                name="specs"
                value={formData.specs}
                onChange={handleChange}
                placeholder="Công nghệ nano bán dẫn FIR, Kích thước: 9x12cm..."
                rows={3}
                className={styles.textarea}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className={styles.formActions}>
        <a href="/admin/products" className={`${styles.btn} ${styles.btnSecondary}`}>
          Hủy bỏ
        </a>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className={styles.btnSpinner}></span>
              Đang lưu...
            </>
          ) : product ? (
            "Cập nhật sản phẩm"
          ) : (
            "Tạo sản phẩm"
          )}
        </button>
      </div>
    </form>
  );
}
