"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FolderTree,
  Save,
} from "lucide-react";
import styles from "../../admin.module.css";
import { generateSlug } from "@/app/lib/validations";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    orderIndex: 0,
    isActive: true,
  });
  
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
      formDataUpload.append("folder", "categories");

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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories?active=false");
      const result = await res.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", imageUrl: "", orderIndex: 0, isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
      orderIndex: cat.orderIndex || 0,
      isActive: cat.isActive,
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : generateSlug(name),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Vui lòng nhập tên và slug danh mục");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (result.success) {
          toast.success("Đã cập nhật danh mục");
          fetchCategories();
          resetForm();
        } else {
          toast.error(result.error || "Lỗi khi cập nhật");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (result.success) {
          toast.success("Đã tạo danh mục mới");
          fetchCategories();
          resetForm();
        } else {
          toast.error(result.error || "Lỗi khi tạo danh mục");
        }
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteModal.category.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteModal.category.id));
        setDeleteModal({ open: false, category: null });
        toast.success("Đã xóa danh mục");
      } else {
        const result = await res.json();
        toast.error(result.error || "Không thể xóa danh mục");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý Danh mục</h1>
          <p className={styles.pageSubtitle}>
            Tổng cộng {categories.length} danh mục
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className={styles.card} style={{ marginBottom: "24px" }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h2>
            <button onClick={resetForm} className={styles.modalClose}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={styles.formInput}
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className={styles.formInput}
                  placeholder="ten-danh-muc"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className={styles.formInput}
                  placeholder="Mô tả ngắn"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Hình ảnh danh mục</label>
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
                            <span>Kéo thả hoặc click để chọn ảnh danh mục từ máy tính</span>
                          </div>
                        )}
                      </div>
                    </label>
                  )}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Thứ tự</label>
                <input
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData((prev) => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    style={{ marginRight: "8px" }}
                  />
                  Hiển thị
                </label>
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={saving}
              >
                <Save size={18} />
                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo mới"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className={styles.card} style={{ marginBottom: "24px" }}>
        <div className={styles.filterRow}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderTree size={48} opacity="0.3" />
            <p>Chưa có danh mục nào</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Thêm danh mục đầu tiên
            </button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Sản phẩm</th>
                  <th>Trạng thái</th>
                  <th style={{ width: "120px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className={styles.productName}>{cat.name}</div>
                    </td>
                    <td>
                      <div className={styles.productSlug}>/{cat.slug}</div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>
                        {cat._count?.products || 0} sản phẩm
                      </span>
                    </td>
                    <td>
                      {cat.isActive ? (
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                          Hiển thị
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeDefault}`}>
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(cat)}
                          className={styles.actionBtn}
                          title="Chỉnh sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, category: cat })}
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal({ open: false, category: null })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Xác nhận xóa</h3>
              <button
                onClick={() => setDeleteModal({ open: false, category: null })}
                className={styles.modalClose}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <strong>{deleteModal.category?.name}</strong>?
              </p>
              <p className={styles.modalWarning}>
                Sản phẩm thuộc danh mục này sẽ bị gỡ khỏi danh mục. Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => setDeleteModal({ open: false, category: null })}
                className={`${styles.btn} ${styles.btnSecondary}`}
                disabled={isDeleting}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.btn} ${styles.btnDanger}`}
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xóa..." : "Xóa danh mục"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .imageUploadSection {
          margin-top: 8px;
        }

        .uploadBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 180px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          cursor: pointer;
          background: #f9fafb;
          transition: all 0.2s;
        }

        .uploadBox:hover {
          border-color: #6d28d9;
          background: #f5f3ff;
        }

        .fileInput {
          display: none;
        }

        .uploadPlaceholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6b7280;
        }

        .uploadText {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          font-size: 0.95rem;
          text-align: center;
          padding: 20px;
        }

        .previewContainer {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .previewImage {
          width: 100%;
          max-width: 320px;
          height: auto;
          max-height: 200px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .deleteImageBtn {
          padding: 8px 16px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .deleteImageBtn:hover {
          background: #fecaca;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #f3f4f6;
          border-top-color: #6d28d9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
