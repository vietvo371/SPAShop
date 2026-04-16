"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  FileText,
  X,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import styles from "../../admin.module.css";
import { toast } from "sonner";

export default function ArticlesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteModal, setDeleteModal] = useState({ open: false, article: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArticles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/articles?${params}`);
      const result = await res.json();

      if (result.success) {
        setArticles(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchArticles]);

  const handleDelete = async () => {
    if (!deleteModal.article) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles/${deleteModal.article.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã xóa bài viết thành công");
        setDeleteModal({ open: false, article: null });
        fetchArticles(pagination.page);
      } else {
        toast.error(result.error || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    } finally {
      setIsDeleting(false);
    }
  };

  const statusMap = {
    PUBLISHED: { label: "Đã xuất bản", class: styles.badgeSuccess },
    DRAFT: { label: "Bản nháp", class: styles.badgePending },
    ARCHIVED: { label: "Đã lưu trữ", class: styles.badgeDefault },
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchArticles(newPage);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý Bài viết</h1>
          <p className={styles.pageSubtitle}>
            Tổng cộng {pagination.total || 0} bài viết.
          </p>
        </div>
        <Link href="/admin/articles/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          <Plus size={18} />
          Viết bài mới
        </Link>
      </div>

      {/* Filters Card */}
      <div className={styles.card} style={{ marginBottom: "24px" }}>
        <div className={styles.filterForm}>
          <div className={styles.filterRow}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="ARCHIVED">Đã lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Table Card */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải bài viết...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} opacity="0.3" />
            <p>Chưa có bài viết nào phù hợp</p>
            <Link href="/admin/articles/new" className={`${styles.btn} ${styles.btnPrimary}`}>
              Bắt đầu viết bài đầu tiên
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th>Ngày đăng</th>
                    <th>Lượt xem</th>
                    <th style={{ width: "120px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <Link href={`/kien-thuc/${article.slug}`} target="_blank" className={styles.articleLink}>
                          <div className={styles.productName}>{article.title}</div>
                        </Link>
                        <div className={styles.productSlug}>/{article.slug}</div>
                      </td>
                      <td>
                        <span className={styles.categoryBadge}>
                          {article.category?.name || "Chưa phân loại"}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${statusMap[article.status]?.class || ""}`}>
                          {statusMap[article.status]?.label || article.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.85rem", color: "#666" }}>
                          {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{article.viewCount?.toLocaleString() || 0}</span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className={styles.actionBtn}
                            title="Chỉnh sửa"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ open: true, article })}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={styles.paginationBtn}
                >
                  <ChevronLeft size={16} /> Trước
                </button>

                <div className={styles.paginationNumbers}>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`${styles.paginationBtn} ${pagination.page === page ? styles.paginationBtnActive : ""}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={styles.paginationBtn}
                >
                  Sau <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal({ open: false, article: null })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Xác nhận xóa</h3>
              <button
                onClick={() => setDeleteModal({ open: false, article: null })}
                className={styles.modalClose}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Bạn có chắc chắn muốn xóa bài viết{" "}
                <strong>{deleteModal.article?.title}</strong>?
              </p>
              <p className={styles.modalWarning}>Hành động này không thể hoàn tác.</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => setDeleteModal({ open: false, article: null })}
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
                {isDeleting ? "Đang xóa..." : "Xóa bài viết"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .articleLink {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }
        .articleLink:hover {
          color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}