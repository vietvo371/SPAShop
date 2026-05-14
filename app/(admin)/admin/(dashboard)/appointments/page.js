"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  List, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Phone,
  Trash2,
  Plus,
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
  CANCELLED: styles.badgeCancelled,
};

const statusDotColors = {
  PENDING: "#d97706",
  CONFIRMED: "#1d4ed8",
  COMPLETED: "#059669",
  CANCELLED: "#dc2626",
};

export default function AppointmentsAdminPage() {
  const [view, setView] = useState("list");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // New Appointment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    serviceId: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "09:00",
    notes: "",
  });

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      const result = await res.json();
      if (result.success) setServices(result.data);
    } catch (_) {}
  }, []);

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

  // Fetch all appointments for calendar (no pagination)
  const fetchAllForCalendar = useCallback(async () => {
    try {
      const year = calendarDate.getFullYear();
      const month = String(calendarDate.getMonth() + 1).padStart(2, "0");
      const res = await fetch(`/api/appointments?limit=200&month=${year}-${month}`);
      const result = await res.json();
      if (result.success) {
        setAllAppointments(result.data);
      }
    } catch (_) {}
  }, [calendarDate]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchAppointments(1); }, 300);
    return () => clearTimeout(timer);
  }, [fetchAppointments]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã thêm lịch hẹn mới");
        setIsModalOpen(false);
        setFormData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          serviceId: "",
          appointmentDate: new Date().toISOString().split("T")[0],
          appointmentTime: "09:00",
          notes: "",
        });
        fetchAppointments(1);
        if (view === "calendar") fetchAllForCalendar();
      } else {
        toast.error(result.error || "Thêm thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi thêm lịch hẹn");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (view === "calendar") fetchAllForCalendar();
  }, [view, fetchAllForCalendar]);

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
        if (view === "calendar") fetchAllForCalendar();
      } else {
        toast.error(result.error || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;
    
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã xóa lịch hẹn");
        fetchAppointments(pagination.page);
        if (view === "calendar") fetchAllForCalendar();
      } else {
        toast.error(result.error || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa lịch hẹn");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAppointments(newPage);
    }
  };

  // ── Calendar helpers ──
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Mon=0
  };

  const getAppointmentsForDay = (day) => {
    const y = calendarDate.getFullYear();
    const m = String(calendarDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;
    return allAppointments.filter(a => {
      const aptDate = new Date(a.appointmentDate).toISOString().slice(0, 10);
      return aptDate === dateStr;
    });
  };

  const selectedDayApts = selectedDay ? getAppointmentsForDay(selectedDay) : [];
  const today = new Date();
  const isToday = (day) =>
    day === today.getDate() &&
    calendarDate.getMonth() === today.getMonth() &&
    calendarDate.getFullYear() === today.getFullYear();

  const daysInMonth = getDaysInMonth(calendarDate.getFullYear(), calendarDate.getMonth());
  const firstDay = getFirstDayOfMonth(calendarDate.getFullYear(), calendarDate.getMonth());
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

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
        <div style={{ display: "flex", gap: "12px" }}>
          <div className={styles.viewSwitch}>
            <button
              className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
              onClick={() => setView("list")}
            >
              <List size={16} /> Danh sách
            </button>
            <button
              className={`${styles.viewBtn} ${view === "calendar" ? styles.viewBtnActive : ""}`}
              onClick={() => setView("calendar")}
            >
              <CalendarIcon size={16} /> Lịch
            </button>
          </div>
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Thêm lịch hẹn
          </button>
        </div>
      </div>

      {view === "list" ? (
        <>
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
            ) : appointments.length === 0 ? (
              <div className={styles.emptyState}>
                <CalendarIcon size={48} opacity="0.3" />
                <p>Không tìm thấy lịch hẹn nào phù hợp</p>
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Khách hàng</th>
                        <th>Liên hệ</th>
                        <th>Dịch vụ</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th style={{ textAlign: "right", width: "160px" }}>Thao tác</th>
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
                            <a href={`tel:${apt.customerPhone}`} className="contactBtn">
                              <Phone size={13} style={{ display: "inline", marginRight: 4 }} />
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
                            <div className={styles.actionButtons} style={{ justifyContent: "flex-end", gap: 6 }}>
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
                                  className={`${styles.btn} ${styles.btnSuccess}`}
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
                              <button
                                className={styles.actionBtn}
                                style={{ color: "#dc2626" }}
                                onClick={() => handleDelete(apt.id)}
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
        </>
      ) : (
        /* ── Calendar View ── */
        <div className={styles.card}>
          {/* Calendar Header */}
          <div className="calHeader">
            <button className="calNavBtn" onClick={() => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
              <ChevronLeft size={18} />
            </button>
            <h2 className="calTitle">
              Tháng {calendarDate.getMonth() + 1} / {calendarDate.getFullYear()}
            </h2>
            <button className="calNavBtn" onClick={() => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Legend */}
          <div className="calLegend">
            {Object.entries(statusLabels).map(([key, label]) => (
              <span key={key} className="legendItem">
                <span className="legendDot" style={{ background: statusDotColors[key] }}></span>
                {label}
              </span>
            ))}
          </div>

          {/* Week days */}
          <div className="calGrid">
            {weekDays.map(d => (
              <div key={d} className="calWeekDay">{d}</div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="calCell calCellEmpty" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dayApts = getAppointmentsForDay(day);
              return (
                <div
                  key={day}
                  className={`calCell ${isToday(day) ? "calCellToday" : ""} ${selectedDay === day ? "calCellSelected" : ""} ${dayApts.length > 0 ? "calCellHasApts" : ""}`}
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                >
                  <span className="calDayNum">{day}</span>
                  <div className="calDots">
                    {dayApts.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="calDot"
                        style={{ background: statusDotColors[a.status] }}
                        title={`${a.customerName} - ${statusLabels[a.status]}`}
                      />
                    ))}
                    {dayApts.length > 3 && <span className="calDotMore">+{dayApts.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected day detail */}
          {selectedDay && (
            <div className="calDetail">
              <h3 className="calDetailTitle">
                Ngày {selectedDay}/{calendarDate.getMonth() + 1}/{calendarDate.getFullYear()}
                {" "}— {selectedDayApts.length} lịch hẹn
              </h3>
              {selectedDayApts.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Không có lịch hẹn nào.</p>
              ) : (
                <div className="calDetailList">
                  {selectedDayApts.map(apt => (
                    <div key={apt.id} className="calDetailItem">
                      <div className="calDetailLeft">
                        <span className="calDetailTime">{apt.appointmentTime || "--:--"}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{apt.customerName}</div>
                          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                            {apt.customerPhone} · {apt.service?.name || "Chưa chọn dịch vụ"}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={`${styles.badge} ${statusColors[apt.status]}`}>
                          {statusLabels[apt.status]}
                        </span>
                        {apt.status === "PENDING" && (
                          <button
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                            onClick={() => handleStatusUpdate(apt.id, "CONFIRMED")}
                          >Xác nhận</button>
                        )}
                        {apt.status === "CONFIRMED" && (
                          <button
                            className={`${styles.btn} ${styles.btnSuccess}`}
                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                            onClick={() => handleStatusUpdate(apt.id, "COMPLETED")}
                          >Hoàn thành</button>
                        )}
                        {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                          <button
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                            onClick={() => handleStatusUpdate(apt.id, "CANCELLED")}
                          >Hủy</button>
                        )}
                        <button
                          className={styles.actionBtn}
                          style={{ color: "#dc2626" }}
                          onClick={() => handleDelete(apt.id)}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                        <a href={`tel:${apt.customerPhone}`} className={`${styles.btn} ${styles.btnSecondary}`} style={{ padding: "4px 10px", fontSize: "0.75rem" }}>
                          <Phone size={13} /> Gọi
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Appointment Modal */}
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Thêm lịch hẹn mới</h3>
              <button className="closeBtn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateAppointment}>
              <div className="formGrid">
                <div className="formGroup">
                  <label>Tên khách hàng *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="formGroup">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    placeholder="090..."
                  />
                </div>
                <div className="formGroup">
                  <label>Email (không bắt buộc)</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    placeholder="khach@gmail.com"
                  />
                </div>
                <div className="formGroup">
                  <label>Dịch vụ</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="formGroup">
                  <label>Ngày hẹn *</label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                  />
                </div>
                <div className="formGroup">
                  <label>Giờ hẹn</label>
                  <input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="formGroup" style={{ marginTop: "16px" }}>
                <label>Ghi chú</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Ghi chú thêm về khách hàng hoặc yêu cầu..."
                ></textarea>
              </div>
              <div className="modalActions">
                <button type="button" className="cancelBtn" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="submitBtn" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu lịch hẹn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modalOverlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modalContent {
          background: white;
          width: 100%;
          max-width: 600px;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }
        .modalHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .modalHeader h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #111827;
        }
        .closeBtn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }
        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .formGroup label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .formGroup input, .formGroup select, .formGroup textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        .formGroup input:focus, .formGroup select:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .modalActions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }
        .cancelBtn {
          padding: 10px 20px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .submitBtn {
          padding: 10px 24px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .submitBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .contactBtn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
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

        /* Calendar */
        .calHeader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 20px;
        }
        .calTitle {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          min-width: 200px;
          text-align: center;
        }
        .calNavBtn {
          width: 36px;
          height: 36px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
          transition: all 0.2s;
        }
        .calNavBtn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        .calLegend {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .legendItem {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }
        .legendDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .calGrid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 24px;
        }
        .calWeekDay {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          padding: 8px 0;
        }
        .calCell {
          min-height: 80px;
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          padding: 6px 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }
        .calCellEmpty {
          background: transparent;
          border-color: transparent;
          cursor: default;
        }
        .calCell:not(.calCellEmpty):hover {
          background: #f9fafb;
          border-color: #e5e7eb;
        }
        .calCellToday {
          border-color: var(--color-primary) !important;
          background: rgba(104, 10, 178, 0.03);
        }
        .calCellSelected {
          background: rgba(104, 10, 178, 0.08) !important;
          border-color: var(--color-primary) !important;
        }
        .calCellHasApts {
          background: #fafafa;
        }
        .calDayNum {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          display: block;
          margin-bottom: 4px;
        }
        .calCellToday .calDayNum {
          color: var(--color-primary);
        }
        .calDots {
          display: flex;
          gap: 3px;
          flex-wrap: wrap;
        }
        .calDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: block;
        }
        .calDotMore {
          font-size: 0.65rem;
          color: #9ca3af;
          font-weight: 600;
          line-height: 1.2;
        }

        /* Day detail panel */
        .calDetail {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
          margin-top: 4px;
        }
        .calDetailTitle {
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
        }
        .calDetailList {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .calDetailItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #f3f4f6;
          gap: 16px;
          flex-wrap: wrap;
        }
        .calDetailLeft {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .calDetailTime {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-primary);
          min-width: 50px;
        }
      `}</style>
    </div>
  );
}