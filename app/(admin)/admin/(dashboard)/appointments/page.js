"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  List, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Search,
  ChevronDown,
  X
} from "lucide-react";
import styles from "../../admin.module.css";
import { toast } from "sonner";

const statusLabels = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const statusColors = {
  PENDING: styles.badgePending,
  CONFIRMED: styles.badgeConfirmed,
  COMPLETED: styles.badgeSuccess,
  CANCELLED: styles.badgeInactive,
};

export default function AppointmentsAdminPage() {
  const [view, setView] = useState("list");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchAppointments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(dateFilter && { date: dateFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const res = await fetch(`/api/appointments?${params}`);
      const result = await res.json();

      if (result.success) {
        setAppointments(result.data);
        setPagination(result.pagination);
      } else {
        toast.error(result.error || "Không thể tải danh sách lịch hẹn");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }, [dateFilter, statusFilter, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchAppointments(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAppointments]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Cập nhật trạng thái thành công");
        fetchAppointments(pagination.page);
      } else {
        toast.error(result.error || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAppointments(newPage);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý Lịch hẹn</h1>
          <p className={styles.pageSubtitle}>
            Tổng cộng {pagination.total || 0} lịch hẹn khách hàng.
          </p>
        </div>
        <div className={styles.viewSwitch}>
          <button
            className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
            onClick={() => setView("list")}
          >
            <List size={18} /> Danh sách
          </button>
          <button
            className={`${styles.viewBtn} ${view === "calendar" ? styles.viewBtnActive : ""}`}
            onClick={() => setView("calendar")}
          >
            <CalendarIcon size={18} /> Lịch
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className={styles.card} style={{ marginBottom: "24px" }}>
        <div className={styles.filterForm}>
          <div className={styles.filterRow}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm tên, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={styles.filterSelect}
                style={{ width: "auto" }}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className={styles.card}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : view === "list" ? (
          <>
            {appointments.length === 0 ? (
              <div className={styles.emptyState}>
                <CalendarIcon size={48} opacity="0.3" />
                <p>Không tìm thấy lịch hẹn nào phù hợp</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Khách hàng</th>
                      <th>Liên hệ</th>
                      <th>Dịch vụ</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right", width: "150px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <div className={styles.productName}>{apt.customerName}</div>
                          <div style={{ fontSize: "0.75rem", color: "#666" }}>{apt.customerPhone}</div>
                        </td>
                        <td>
                          <a href={`tel:${apt.customerPhone}`} className={styles.contactBtn}>
                            Gọi điện
                          </a>
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>
                            {apt.service?.name || "Chưa chọn"}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{apt.appointmentTime || "--:--"}</div>
                          <div style={{ fontSize: "0.85rem", color: "#666" }}>
                            {new Date(apt.appointmentDate).toLocaleDateString("vi-VN")}
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${statusColors[apt.status]}`}>
                            {statusLabels[apt.status]}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className={styles.actionButtons} style={{ justifyContent: "flex-end" }}>
                            {apt.status === "PENDING" && (
                              <button
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                onClick={() => handleStatusUpdate(apt.id, "CONFIRMED")}
                              >
                                Xác nhận
                              </button>
                            )}
                            {apt.status === "CONFIRMED" && (
                              <button
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                onClick={() => handleStatusUpdate(apt.id, "COMPLETED")}
                              >
                                Hoàn thành
                              </button>
                            )}
                            {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                              <button
                                className={`${styles.btn} ${styles.btnSecondary}`}
                                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                                onClick={() => handleStatusUpdate(apt.id, "CANCELLED")}
                              >
                                Hủy
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
        ) : (
          <div className={styles.emptyState}>
            <CalendarIcon size={64} opacity="0.2" />
            <h3>Chế độ xem lịch</h3>
            <p>Tính năng xem lịch trực quan đang được tối ưu hóa.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .contactBtn {
          display: inline-block;
          padding: 4px 10px;
          background: #f3f4f6;
          color: #374151;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .contactBtn:hover {
          background: #e5e7eb;
          color: var(--color-primary);
        }
        .viewSwitch {
          display: flex;
          background: #f3f4f6;
          padding: 4px;
          border-radius: 8px;
        }
        .viewBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .viewBtnActive {
          background: white;
          color: var(--color-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}