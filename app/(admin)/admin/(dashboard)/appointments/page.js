"use client";

import { useState, useEffect, useCallback } from "react";
import { List, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchAppointments = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(dateFilter && { date: dateFilter }),
        ...(statusFilter && { status: statusFilter }),
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, statusFilter]);

  useEffect(() => {
    fetchAppointments(1);
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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Quản lý Lịch hẹn</h1>
        <div className={styles.viewSwitch}>
          <button
            className={`${styles.viewBtn} ${view === "list" ? styles.active : ""}`}
            onClick={() => setView("list")}
          >
            <List size={18} /> Danh sách
          </button>
          <button
            className={`${styles.viewBtn} ${view === "calendar" ? styles.active : ""}`}
            onClick={() => setView("calendar")}
          >
            <CalendarIcon size={18} /> Lịch
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <div className={styles.formGroup}>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.formSelect}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xác nhận</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Appointments List */}
          {view === "list" && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Dịch vụ</th>
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((apt) => (
                      <tr key={apt.id}>
                        <td className={styles.customerName}>{apt.customerName}</td>
                        <td><a href={`tel:${apt.customerPhone}`}>{apt.customerPhone}</a></td>
                        <td>{apt.service?.name || "Chưa chọn"}</td>
                        <td>{new Date(apt.appointmentDate).toLocaleDateString("vi-VN")}</td>
                        <td>{apt.appointmentTime || "--:--"}</td>
                        <td>
                          <span className={`${styles.badge} ${statusColors[apt.status]}`}>
                            {statusLabels[apt.status]}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            {apt.status === "PENDING" && (
                              <button
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                onClick={() => handleStatusUpdate(apt.id, "CONFIRMED")}
                              >
                                ✓ Xác nhận
                              </button>
                            )}
                            {apt.status === "CONFIRMED" && (
                              <button
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                onClick={() => handleStatusUpdate(apt.id, "COMPLETED")}
                              >
                                ✓ Hoàn thành
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
                        Không có lịch hẹn nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchAppointments(pagination.page - 1)}
                className={styles.paginationBtn}
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.paginationInfo}>
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchAppointments(pagination.page + 1)}
                className={styles.paginationBtn}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Calendar View Placeholder */}
      {view === "calendar" && (
        <div className={styles.calendarPlaceholder}>
          <p style={{ textAlign: "center", color: "#6b7280", padding: "60px 0" }}>
            <CalendarIcon size={48} style={{ display: "block", margin: "0 auto 16px", opacity: 0.3 }} />
            Chế độ xem lịch đang được phát triển
          </p>
        </div>
      )}
    </div>
  );
}