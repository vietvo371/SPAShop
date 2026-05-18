"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../../admin.module.css";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";

export default function EditServicePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        const result = await response.json();

        if (result.success) {
          const service = result.data;
          setFormData({
            name: service.name || "",
            slug: service.slug || "",
            description: service.description || "",
            price: service.price || "",
            duration: service.duration || "",
            features: service.process || "", // Mapping process to features
            imageUrl: service.imageUrl || "",
            isActive: service.isActive ?? true,
          });
        }
      } catch (err) {
        toast.error("Không tìm thấy dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã cập nhật dịch vụ thành công!");
        router.push("/admin/services");
      } else {
        toast.error(result.error || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật dịch vụ");
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <a href="/admin/services" className={styles.breadcrumbLink}>Dịch vụ</a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>Chỉnh sửa</span>
        </div>
        <h1>Chỉnh sửa dịch vụ</h1>
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
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isSubmitting}>
            <Save size={18} />
            {isSubmitting ? "Đang lưu..." : "Cập nhật dịch vụ"}
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
          color: #4b5563;
        }

        .formInput {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .formInput:focus {
          border-color: #6d28d9;
          box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
          outline: none;
        }
      `}</style>
    </div>
  );
}
