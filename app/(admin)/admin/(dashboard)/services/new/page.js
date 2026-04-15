"use client";

import { useState } from "react";
import styles from "../../../admin.module.css";

export default function NewServicePage() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    duration: "",
    features: "",
    imageUrl: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSlugAuto = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đã tạo dịch vụ mới!");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Thêm Dịch vụ Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.settingsContent}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tên dịch vụ *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleSlugAuto}
              required
              className={styles.formInput}
              placeholder="VD: Khai thông vùng đầu"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Slug (URL)</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="khai-thong-vung-dau"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Giá (VNĐ)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="280.000"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Thời gian</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="45-60 phút"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.formTextarea}
              rows={4}
              placeholder="Mô tả chi tiết dịch vụ..."
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Tính năng (mỗi dòng 1)</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              className={styles.formTextarea}
              rows={4}
              placeholder="Nâng cơ mặt, trẻ hóa da&#10;Detox da đầu, giảm mụn&#10;Giảm đau đầu & stress"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>URL hình ảnh</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="https://..."
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Đang hiển thị</span>
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <a href="/admin/services" className={`${styles.btn} ${styles.btnSecondary}`}>
            ← Hủy
          </a>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            💾 Tạo dịch vụ
          </button>
        </div>
      </form>

      <style jsx>{`
        .formTextarea {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          transition: var(--transition);
        }

        .formTextarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(104, 10, 178, 0.1);
        }

        .checkboxLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #374151;
        }

        .checkboxLabel input {
          width: 18px;
          height: 18px;
        }

        .formActions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .settingsContent {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}