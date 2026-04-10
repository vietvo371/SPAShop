"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products
  const fetchProducts = async (page = 1, searchQuery = search, categoryId = categoryFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
        ...(categoryId && { categoryId }),
      });

      const response = await fetch(`/api/products?${params}`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
        setPagination({
          page: result.pagination.page,
          totalPages: result.pagination.totalPages,
          total: result.pagination.total,
        });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
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

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, search, categoryFilter);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteModal.product) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${deleteModal.product.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== deleteModal.product.id));
        setDeleteModal({ open: false, product: null });
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, search, categoryFilter);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý Sản phẩm</h1>
          <p className={styles.pageSubtitle}>
            Tổng cộng {pagination.total} sản phẩm
          </p>
        </div>
        <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.card} style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.filterRow}>
            <div className={styles.searchWrapper}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={styles.searchIcon}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                fetchProducts(1, search, e.target.value);
              }}
              className={styles.filterSelect}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button type="submit" className={`${styles.btn} ${styles.btnSecondary}`}>
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải...</p>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
              <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z"/>
            </svg>
            <p>Chưa có sản phẩm nào</p>
            <Link href="/admin/products/new" className={`${styles.btn} ${styles.btnPrimary}`}>
              Thêm sản phẩm đầu tiên
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá</th>
                    <th>Nổi bật</th>
                    <th style={{ width: "120px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.productImage}>
                          {product.primaryImage || product.imageUrl ? (
                            <img
                              src={product.primaryImage || product.imageUrl}
                              alt={product.name}
                              className={styles.thumbnail}
                            />
                          ) : (
                            <div className={styles.noImage}>No Image</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.productSlug}>/{product.slug}</div>
                      </td>
                      <td>
                        {product.category ? (
                          <span className={styles.categoryBadge}>
                            {product.category.name}
                          </span>
                        ) : (
                          <span className={styles.noCategory}>Chưa phân loại</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.price}>{product.price}</span>
                      </td>
                      <td>
                        {product.isFeatured ? (
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            Nổi bật
                          </span>
                        ) : (
                          <span className={`${styles.badge} ${styles.badgeDefault}`}>
                            Thường
                          </span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className={styles.actionBtn}
                            title="Chỉnh sửa"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ open: true, product })}
                            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                            title="Xóa"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
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
                  ← Trước
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
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal({ open: false, product: null })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Xác nhận xóa</h3>
              <button
                onClick={() => setDeleteModal({ open: false, product: null })}
                className={styles.modalClose}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                <strong>{deleteModal.product?.name}</strong>?
              </p>
              <p className={styles.modalWarning}>Hành động này không thể hoàn tác.</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => setDeleteModal({ open: false, product: null })}
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
                {isDeleting ? "Đang xóa..." : "Xóa sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
