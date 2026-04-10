import Link from "next/link";
import styles from "./admin.module.css";

const adminNavItems = [
  {
    section: "Quản lý",
    items: [
      { href: "/admin", label: "Tổng quan", icon: "📊" },
      { href: "/admin/products", label: "Sản phẩm", icon: "📦" },
      { href: "/admin/services", label: "Dịch vụ", icon: "🛠️" },
      { href: "/admin/articles", label: "Bài viết", icon: "📝" },
      { href: "/admin/appointments", label: "Lịch hẹn", icon: "📅" },
      { href: "/admin/contact", label: "Liên hệ", icon: "💬" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <span className={styles.logoIcon}>🏥</span>
            <span className={styles.logoText}>Tâm An Admin</span>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          {adminNavItems.map((section) => (
            <div key={section.section} className={styles.navSection}>
              <h3 className={styles.navSectionTitle}>{section.section}</h3>
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.navLink}>
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.footerLink}>
            <span>🌐</span> Xem website
          </Link>
          <button className={styles.footerLink}>
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <div className={styles.headerActions}>
            <span className={styles.adminBadge}>Admin</span>
          </div>
        </header>

        <div className={styles.contentBody}>{children}</div>
      </main>
    </div>
  );
}
