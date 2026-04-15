"use client";

import { useState } from "react";
import styles from "../admin.module.css";

const appointments = [
  { id: 1, customerName: "Nguyễn Văn A", phone: "0912345678", service: "Khai thông vùng đầu", date: "15/04/2026", time: "09:00", status: "PENDING" },
  { id: 2, customerName: "Trần Thị B", phone: "0987654321", service: "Cổ vai gáy", date: "15/04/2026", time: "10:30", status: "CONFIRMED" },
  { id: 3, customerName: "Lê Văn C", phone: "0934567890", service: "Phục hồi thận khí", date: "15/04/2026", time: "14:00", status: "PENDING" },
  { id: 4, customerName: "Phạm Thị D", phone: "0978901234", service: "Bài độc gan", date: "16/04/2026", time: "09:30", status: "COMPLETED" },
  { id: 5, customerName: "Hoàng Văn E", phone: "0967890123", service: "Kiện tỳ vị", date: "16/04/2026", time: "11:00", status: "CONFIRMED" },
];

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

  const filteredAppointments = appointments.filter(a => {
    const matchDate = dateFilter ? a.date === dateFilter : true;
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchDate && matchStatus;
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Quản lý Lịch hẹn</h1>
        <div className={styles.viewSwitch}>
          <button 
            className={`${styles.viewBtn} ${view === "list" ? styles.active : ""}`}
            onClick={() => setView("list")}
          >
            📋 Danh sách
          </button>
          <button 
            className={`${styles.viewBtn} ${view === "calendar" ? styles.active : ""}`}
            onClick={() => setView("calendar")}
          >
            📅 Lịch
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <input 
          type="date" 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          className={styles.dateInput}
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
              {filteredAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td className={styles.customerName}>{apt.customerName}</td>
                  <td><a href={`tel:${apt.phone}`}>{apt.phone}</a></td>
                  <td>{apt.service}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>
                    <span className={`${styles.badge} ${statusColors[apt.status]}`}>
                      {statusLabels[apt.status]}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      {apt.status === "PENDING" && (
                        <button 
                          className={styles.btnSuccess}
                          onClick={() => alert("Đã xác nhận lịch hẹn")}
                        >
                          ✓ Xác nhận
                        </button>
                      )}
                      {apt.status === "CONFIRMED" && (
                        <button 
                          className={styles.btnPrimary}
                          onClick={() => alert("Đã hoàn thành lịch hẹn")}
                        >
                          ✓ Hoàn thành
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

      {/* Calendar View Placeholder */}
      {view === "calendar" && (
        <div className={styles.calendarPlaceholder}>
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "60px 0" }}>
            📅 Chế độ xem lịch đang được phát triển
          </p>
        </div>
      )}

      {filteredAppointments.length === 0 && (
        <div className={styles.emptyState}>
          <p>Không có lịch hẹn nào</p>
        </div>
      )}
    </div>
  );
}