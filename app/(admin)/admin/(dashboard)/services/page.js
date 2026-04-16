"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Wrench,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import styles from "../../admin.module.css";
import { toast } from "sonner";
import { formatPrice } from "@/app/lib/utils";

export default function ServicesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, service: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const result = await res.json();
      if (result.success) {
        setServices(result.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal.service) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/services/${deleteModal.service.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã xóa dịch vụ thành công");
        setDeleteModal({ open: false, service: null });
        fetchServices();
      } else {
        toast.error(result.error || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa dịch vụ");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý Dịch vụ</h1>
          <p className={styles.pageSubtitle}>
            Tổng cộng {services.length} dịch vụ chăm sóc.
          </p>
        </div>
        <Link href="/admin/services/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          <Plus size={18} />
          Thêm dịch vụ mới
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.card} style={{ marginBottom: "24px" }}>
        <div className={styles.filterForm}>
          <div className={styles.filterRow}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            {/* You could add a status filter for services if needed */}
          </div>
        </div>
      </div>

      {/* Services Table Card */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải dịch vụ...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className={styles.emptyState}>
            <Wrench size={48} opacity="0.3" />
            <p>Chưa có dịch vụ nào phù hợp</p>
            <Link href="/admin/services/new" className={`${styles.btn} ${styles.btnPrimary}`}>
              Thêm dịch vụ đầu tiên
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Giá (VNĐ)</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th style={{ width: "120px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className={styles.productName}>
                        <Link href={`/dich-vu-cham-soc/${service.slug}`} target="_blank" className={styles.serviceLink}>
                          {service.name}
                        </Link>
                      </div>
                      <div className={styles.productSlug}>/{service.slug}</div>
                    </td>
                    <td>
                      <span className={styles.price}>{formatPrice(service.price)}</span>
                    </td>
                    <td>{service.duration || "N/A"}</td>
                    <td>
                      <span className={`${styles.badge} ${service.isActive ? styles.badgeSuccess : styles.badgeDefault}`}>
                        {service.isActive ? "Đang hiển thị" : "Đã ẩn"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Link
                          href={`/admin/services/${service.id}`}
                          className={styles.actionBtn}
                          title="Chỉnh sửa"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, service })}
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

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal({ open: false, service: null })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Xác nhận xóa</h3>
              <button
                onClick={() => setDeleteModal({ open: false, service: null })}
                className={styles.modalClose}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Bạn có chắc chắn muốn xóa dịch vụ{" "}
                <strong>{deleteModal.service?.name}</strong>?
              </p>
              <p className={styles.modalWarning}>Hành động này không thể hoàn tác.</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => setDeleteModal({ open: false, service: null })}
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
                {isDeleting ? "Đang xóa..." : "Xóa dịch vụ"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .serviceLink {
            color: inherit;
            text-decoration: none;
            transition: color 0.2s;
        }
        .serviceLink:hover {
            color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}