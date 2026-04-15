"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../admin.module.css";
import { toast } from "sonner";

export default function ArticlesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

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

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã xóa bài viết");
        fetchArticles(pagination.page);
      } else {
        toast.error(result.error || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED": return styles.badgeSuccess;
      case "DRAFT": return styles.badgePending;
      case "ARCHIVED": return styles.badgeInactive;
      default: return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PUBLISHED": return "Đã xuất bản";
      case "DRAFT": return "Bản nháp";
      case "ARCHIVED": return "Đã lưu trữ";
      default: return status;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Quản lý Bài viết</h1>
        <Link href="/admin/articles/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          <Plus size={18} /> Viết bài mới
        </Link>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải bài viết...</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                  <th>Lượt xem</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <Link href={`/kien-thuc/${article.slug}`} target="_blank" className={styles.articleTitle}>
                          {article.title}
                        </Link>
                      </td>
                      <td>{article.category?.name || "Chưa có"}</td>
                      <td>
                        <span className={`${styles.badge} ${getStatusBadge(article.status)}`}>
                          {getStatusLabel(article.status)}
                        </span>
                      </td>
                      <td>{new Date(article.createdAt).toLocaleDateString("vi-VN")}</td>
                      <td>{article.viewCount?.toLocaleString() || 0}</td>
                      <td>
                        <div className={styles.actionBtns}>
                          <Link href={`/admin/articles/${article.id}`} className={styles.btnIcon} title="Sửa">
                            <Pencil size={16} />
                          </Link>
                          <button
                            className={styles.btnIcon}
                            title="Xóa"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
                      Không tìm thấy bài viết nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchArticles(pagination.page - 1)}
                className={styles.paginationBtn}
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.paginationInfo}>
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchArticles(pagination.page + 1)}
                className={styles.paginationBtn}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}