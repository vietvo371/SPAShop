"use client";

import { useState } from "react";
import styles from "../../../admin.module.css";
import { toast } from "sonner";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ chọn file hình ảnh");
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "articles");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
        toast.success("Upload ảnh thành công");
      } else {
        toast.error(result.error || "Lỗi khi upload ảnh");
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã tạo bài viết mới!");
        window.location.href = "/admin/articles";
      } else {
        toast.error(result.error || "Tạo thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo bài viết");
    }
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
            <label className={styles.formLabel}>Hình ảnh đại diện</label>
            <div className="imageUploadSection">
              {formData.imageUrl ? (
                <div className="previewContainer">
                  <img src={formData.imageUrl} alt="Preview" className="previewImage" />
                  <button 
                    type="button" 
                    className="deleteImageBtn"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                  >
                    Xóa ảnh
                  </button>
                </div>
              ) : (
                <label className="uploadBox">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="fileInput"
                    disabled={uploading}
                  />
                  <div className="uploadPlaceholder">
                    {uploading ? (
                      <div className="spinner"></div>
                    ) : (
                      <div className="uploadText">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                        </svg>
                        <span>Kéo thả hoặc click để chọn ảnh bài viết từ máy tính</span>
                      </div>
                    )}
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/articles" className={`${styles.btn} ${styles.btnSecondary}`}>
            <ArrowLeft size={18} /> Hủy
          </Link>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={18} />
            Tạo bài viết
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
          align-items: center;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .settingsContent {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .imageUploadSection {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .previewContainer {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .previewImage {
          width: 200px;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
        }

        .deleteImageBtn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .deleteImageBtn:hover {
          background: #dc2626;
        }

        .uploadBox {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: 120px;
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .uploadBox:hover {
          border-color: #6d28d9;
          background: #f5f3ff;
        }

        .fileInput {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          z-index: 10;
        }

        .uploadPlaceholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .uploadText {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.85rem;
          padding: 10px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #6d28d9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .formGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .fullWidth {
          grid-column: span 2;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .formLabel {
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
        }

        .formInput, .formSelect, .formTextarea {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
          background: #fff;
        }

        .formInput:focus, .formSelect:focus, .formTextarea:focus {
          border-color: #6d28d9;
          box-shadow: 0 0 0 4px rgba(109, 40, 217, 0.1);
          outline: none;
        }
      `}</style>
    </div>
  );
}