import Link from "next/link";
import { cookies } from "next/headers";
import {
  LayoutDashboard,
  Package,
  Wrench,
  FileText,
  CalendarDays,
  MessageSquare,
  ExternalLink,
  LogOut,
  Cross,
} from "lucide-react";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

const adminNavItems = [
  {
    section: "Quản lý",
    items: [
      { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
      { href: "/admin/products", label: "Sản phẩm", icon: Package },
      { href: "/admin/services", label: "Dịch vụ", icon: Wrench },
      { href: "/admin/articles", label: "Bài viết", icon: FileText },
      { href: "/admin/appointments", label: "Lịch hẹn", icon: CalendarDays },
      { href: "/admin/contact", label: "Liên hệ", icon: MessageSquare },
    ],
  },
];

async function getUserName() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("chanan_auth_token")?.value;
    if (!token) return "Admin";
    return "Admin";
  } catch {
    return "Admin";
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const userName = await getUserName();

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <Cross className={styles.logoIcon} size={24} />
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
                      <item.icon className={styles.navIcon} size={20} />
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
            <ExternalLink size={18} />
            <span>Xem website</span>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className={styles.footerLink}>
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.contentHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <div className={styles.headerActions}>
            <span className={styles.adminBadge}>{userName}</span>
          </div>
        </header>

        <div className={styles.contentBody}>{children}</div>
      </main>
    </div>
  );
}
