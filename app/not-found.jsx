import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundIcon}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" stroke="#680ab2" strokeWidth="4" strokeDasharray="8 4" />
            <path d="M60 35 L60 65 L80 80" stroke="#680ab2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="60" cy="60" r="4" fill="#680ab2" />
          </svg>
        </div>

        <h1 className={styles.notFoundCode}>404</h1>
        <h2 className={styles.notFoundTitle}>Oops! Trang không tồn tại</h2>
        <p className={styles.notFoundDesc}>
          Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc thông tin đã thay đổi.
        </p>

        <div className={styles.notFoundActions}>
          <Link href="/" className={styles.btnPrimary}>
            Quay về trang chủ
          </Link>
          <Link href="/lien-he" className={styles.btnSecondary}>
            Liên hệ hỗ trợ
          </Link>
        </div>

        <div className={styles.notFoundSuggestion}>
          <p>Bạn có thể tìm thấy thông tin mình cần tại:</p>
          <div className={styles.suggestionLinks}>
            <Link href="/san-pham">Sản phẩm công nghệ</Link>
            <Link href="/dich-vu-cham-soc">Dịch vụ chăm sóc</Link>
            <Link href="/kien-thuc">Kiến thức sức khỏe</Link>
          </div>
        </div>
      </div>
    </div>
  );
}