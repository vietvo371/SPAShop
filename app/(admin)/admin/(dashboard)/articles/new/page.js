"use client";

import { useState } from "react";
import styles from "../../../admin.module.css";

export default function NewArticlePage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    category: "Kiến thức FIR",
    status: "DRAFT",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugAuto = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đã tạo bài viết mới!");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Viết Bài Mới</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.settingsContent}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tiêu đề *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleSlugAuto}
              required
              className={styles.formInput}
              placeholder="VD: Hồng ngoại xa là gì?"
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
              placeholder="hong-ngoai-xa-la-gi"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Danh mục</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="Kiến thức FIR">Kiến thức FIR</option>
              <option value="Hướng dẫn">Hướng dẫn</option>
              <option value="Sức khỏe">Sức khỏe</option>
              <option value="Y học cổ truyền">Y học cổ truyền</option>
              <option value="Sản phẩm">Sản phẩm</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="DRAFT">Bản nháp</option>
              <option value="PUBLISHED">Xuất bản</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Tóm tắt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className={styles.formTextarea}
              rows={3}
              placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>Nội dung (HTML)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={styles.formTextarea}
              rows={10}
              placeholder="<h2>Tiêu đề</h2>&#10;<p>Nội dung...</p>"
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.formLabel}>URL hình ảnh đại diện</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <a href="/admin/articles" className={`${styles.btn} ${styles.btnSecondary}`}>
            ← Hủy
          </a>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            💾 Tạo bài viết
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

        .formSelect {
          padding: 10px 36px 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }

        .formSelect:focus {
          outline: none;
          border-color: var(--color-primary);
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