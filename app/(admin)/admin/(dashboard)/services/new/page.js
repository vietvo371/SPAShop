"use client";

import { useState } from "react";
import styles from "../../../admin.module.css";
import { toast } from "sonner";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
  const [uploading, setUploading] = useState(false);

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
      formDataUpload.append("folder", "services");

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
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã tạo dịch vụ mới!");
        window.location.href = "/admin/services";
      } else {
        toast.error(result.error || "Tạo thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo dịch vụ");
    }
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
            <label className={styles.formLabel}>Hình ảnh dịch vụ</label>
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
                        <span>Kéo thả hoặc click để chọn ảnh dịch vụ từ máy tính</span>
                      </div>
                    )}
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <div className="checkboxWrapper">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="checkboxInput"
              />
              <label htmlFor="isActive" className="checkboxLabelText">
                Hiển thị dịch vụ này trên trang chủ
              </label>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/services" className={`${styles.btn} ${styles.btnSecondary}`}>
            <ArrowLeft size={18} /> Hủy
          </Link>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={18} />
            Tạo dịch vụ
          </button>
        </div>
      </form>

      <style jsx>{`
        .formTextarea {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          resize: vertical;
          transition: all 0.2s;
        }

        .formTextarea:focus {
          outline: none;
          border-color: #6d28d9;
          box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
        }

        .checkboxWrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 8px;
          width: fit-content;
        }

        .checkboxInput {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #6d28d9;
        }

        .checkboxLabelText {
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          font-family: sans-serif;
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
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
          width: 28px;
          height: 28px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #6d28d9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}