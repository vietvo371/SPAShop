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
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      // If product has no gallery images but has a primary imageUrl, create a virtual gallery
      let initialImages = product.images || [];
      if (initialImages.length === 0 && product.imageUrl) {
        initialImages = [{
          url: product.imageUrl,
          isPrimary: true,
          orderIndex: 0
        }];
      }

      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        price: product.price || "",
        description: product.description || "",
        specs: product.specs || "",
        imageUrl: product.imageUrl || "",
        categoryId: product.categoryId || "",
        isFeatured: product.isFeatured || false,
        images: initialImages,
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
    if (name === "name") {
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
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, images: "Vui lòng chỉ chọn file hình ảnh" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: "Kích thước file không được vượt quá 5MB" }));
        return;
      }
    }

    setUploading(true);
    setErrors((prev) => ({ ...prev, images: null }));

    try {
      const newImages = [...formData.images];

      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "products");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const result = await response.json();

        if (result.success) {
          newImages.push({
            url: result.url,
            isPrimary: newImages.length === 0, // First image is primary by default
            orderIndex: newImages.length,
          });
        }
      }

      setFormData((prev) => ({ ...prev, images: newImages }));

      // Also update legacy imageUrl if it's currently empty
      if (!formData.imageUrl && newImages.length > 0) {
        const primary = newImages.find(img => img.isPrimary) || newImages[0];
        setFormData(prev => ({ ...prev, imageUrl: primary.url }));
      }

    } catch (error) {
      console.error("Upload error:", error);
      setErrors((prev) => ({ ...prev, images: "Lỗi khi upload hình ảnh" }));
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryImage = (index) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
      imageUrl: updatedImages[index].url // Update legacy field too
    }));
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);

    // If we removed the primary image, set a new one
    if (formData.images[index]?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
      imageUrl: updatedImages.length > 0 ? updatedImages.find(img => img.isPrimary)?.url || updatedImages[0].url : ""
    }));
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

    if (formData.price === undefined || formData.price === null || formData.price === "") {
      newErrors.price = "Giá không được trống (nhập 0 nếu muốn hiển thị 'Liên hệ')";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "Giá phải là số";
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
                readOnly
                placeholder="slug-tu-dong-sinh-ra"
                className={`${styles.input} ${styles.readOnlyInput}`}
              />
              <span className={styles.hint}>URL thân thiện: /san-pham/{formData.slug || "..."}</span>
              {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giá <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ví dụ: 1500000 (Để 0 nếu muốn hiện 'Liên hệ')"
                className={`${styles.input} ${errors.price ? styles.inputError : ""}`}
              />
              <span className={styles.hint}>Nhập số nguyên. Ví dụ: 1500000 = 1.500.000₫. Nhập 0 để ẩn nút đặt hàng.</span>
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
              <label className={styles.uploadLabel}>
                <input
                  type="file"
                  multiple
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
                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                      </svg>
                      <span>Click để chọn hoặc kéo thả nhiều hình ảnh</span>
                    </>
                  )}
                </div>
              </label>
              {errors.images && <span className={styles.errorText}>{errors.images}</span>}

              {/* Gallery Preview */}
              <div className={styles.imageGallery}>
                {formData.images.map((img, index) => (
                  <div key={index} className={`${styles.imageItem} ${img.isPrimary ? styles.primary : ""}`}>
                    {img.isPrimary && <span className={styles.primaryBadge}>Chính</span>}
                    <img src={img.url} alt={`Product ${index}`} className={styles.galleryImage} />

                    <div className={styles.imageOverlay}>
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className={styles.imageActionBtn}
                          title="Đặt làm ảnh chính"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={`${styles.imageActionBtn} ${styles.remove}`}
                        title="Xóa ảnh"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
