"use client";

import { useState, useEffect } from "react";
import { Package, Calendar, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";
import styles from "../admin.module.css";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const { stats, recentAppointments, recentMessages } = data || {
    stats: { products: 0, appointmentsToday: 0, newMessages: 0, totalViews: 0 },
    recentAppointments: [],
    recentMessages: []
  };

  return (
    <>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <Package size={24} color="#3b82f6" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.products}</div>
            <div className={styles.statLabel}>Sản phẩm</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <Calendar size={24} color="#10b981" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.appointmentsToday}</div>
            <div className={styles.statLabel}>Lịch hẹn hôm nay</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <MessageSquare size={24} color="#8b5cf6" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.newMessages}</div>
            <div className={styles.statLabel}>Tin nhắn mới</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.orange}`}>
            <Eye size={24} color="#f59e0b" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalViews.toLocaleString()}</div>
            <div className={styles.statLabel}>Tổng lượt xem</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent Appointments */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Lịch hẹn gần đây</h2>
            <Link href="/admin/appointments" className={`${styles.btn} ${styles.btnSecondary}`}>
              Xem tất cả
            </Link>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dịch vụ</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>{apt.customerName}</td>
                      <td>{apt.service?.name || "Chưa chọn"}</td>
                      <td>{new Date(apt.appointmentDate).toLocaleDateString("vi-VN")}</td>
                      <td>
                        <span className={`${styles.badge} ${apt.status === "PENDING" ? styles.badgePending :
                            apt.status === "CONFIRMED" ? styles.badgeConfirmed :
                              apt.status === "COMPLETED" ? styles.badgeSuccess :
                                styles.badgeInactive
                          }`}>
                          {apt.status === "PENDING" ? "Chờ xác nhận" :
                            apt.status === "CONFIRMED" ? "Đã xác nhận" :
                              apt.status === "COMPLETED" ? "Hoàn thành" :
                                "Đã hủy"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>Chưa có lịch hẹn nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Tin nhắn mới</h2>
            <Link href="/admin/contact" className={`${styles.btn} ${styles.btnSecondary}`}>
              Xem tất cả
            </Link>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Người gửi</th>
                  <th>Nội dung</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.length > 0 ? (
                  recentMessages.map((msg) => (
                    <tr key={msg.id}>
                      <td>{msg.name}</td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.message}
                      </td>
                      <td>{new Date(msg.createdAt).toLocaleDateString("vi-VN")}</td>
                      <td>
                        <span className={`${styles.badge} ${msg.status === "NEW" ? styles.badgeNew :
                            msg.status === "READ" ? styles.badgeRead :
                              styles.badgeReplied
                          }`}>
                          {msg.status === "NEW" ? "Mới" :
                            msg.status === "READ" ? "Đã đọc" :
                              "Đã trả lời"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>Chưa có tin nhắn nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
