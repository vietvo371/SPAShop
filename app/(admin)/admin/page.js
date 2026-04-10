import styles from "./admin.module.css";

export default function AdminDashboard() {
  return (
    <>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}>📦</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>20</div>
            <div className={styles.statLabel}>Sản phẩm</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}>📅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>12</div>
            <div className={styles.statLabel}>Lịch hẹn hôm nay</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>💬</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>5</div>
            <div className={styles.statLabel}>Tin nhắn mới</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.orange}`}>👁️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>1,234</div>
            <div className={styles.statLabel}>Lượt xem tuần này</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent Appointments */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Lịch hẹn gần đây</h2>
            <a href="/admin/appointments" className={`${styles.btn} ${styles.btnSecondary}`}>
              Xem tất cả
            </a>
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
                <tr>
                  <td>Nguyễn Văn A</td>
                  <td>Soi Mạch Máu</td>
                  <td>09/04/2026</td>
                  <td><span className={`${styles.badge} ${styles.badgePending}`}>Chờ xác nhận</span></td>
                </tr>
                <tr>
                  <td>Trần Thị B</td>
                  <td>Điều trị Gout</td>
                  <td>09/04/2026</td>
                  <td><span className={`${styles.badge} ${styles.badgeConfirmed}`}>Đã xác nhận</span></td>
                </tr>
                <tr>
                  <td>Lê Văn C</td>
                  <td>Đo Kinh Lạc</td>
                  <td>10/04/2026</td>
                  <td><span className={`${styles.badge} ${styles.badgePending}`}>Chờ xác nhận</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Tin nhắn mới</h2>
            <a href="/admin/contact" className={`${styles.btn} ${styles.btnSecondary}`}>
              Xem tất cả
            </a>
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
                <tr>
                  <td>Phạm Thị D</td>
                  <td>Tôi muốn đặt lịch khám...</td>
                  <td>10 phút trước</td>
                  <td><span className={`${styles.badge} ${styles.badgeNew}`}>Mới</span></td>
                </tr>
                <tr>
                  <td>Hoàng Văn E</td>
                  <td>Hỏi về sản phẩm đai lưng...</td>
                  <td>30 phút trước</td>
                  <td><span className={`${styles.badge} ${styles.badgeNew}`}>Mới</span></td>
                </tr>
                <tr>
                  <td>Vũ Thị F</td>
                  <td>Muốn biết giá dịch vụ...</td>
                  <td>1 giờ trước</td>
                  <td><span className={`${styles.badge} ${styles.badgeRead}`}>Đã đọc</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
