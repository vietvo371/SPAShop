"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import styles from "../../admin.module.css";
import { formatPrice } from "@/app/lib/utils";

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
          <Plus size={18} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.card} style={{ marginBottom: "24px" }}>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.filterRow}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
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
            <Package size={48} opacity="0.3" />
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
                        <span className={styles.price}>{formatPrice(product.price)}</span>
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
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ open: true, product })}
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
                <X size={20} />
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
