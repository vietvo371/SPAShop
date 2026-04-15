import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import Sidebar from "./Sidebar";
import styles from "../admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "ADMIN" && user.role !== "OWNER")) {
    redirect("/admin/login");
  }

  const userName = user.name || "Admin";

  return (
    <div className={styles.adminLayout}>
      <Sidebar />

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
