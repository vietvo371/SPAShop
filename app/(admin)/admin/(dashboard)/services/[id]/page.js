"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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
            <label className={styles.formLabel}>URL hình ảnh</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={styles.formInput}
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

        .checkboxLabel {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.9rem;
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

        .formGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .fullWidth {
          grid-column: span 2;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .formLabel {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
        }

        .formInput {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
