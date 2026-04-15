"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    X
} from "lucide-react";
import { toast } from "sonner";
import styles from "../admin.module.css";

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

export default function Sidebar() {
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Đã đăng xuất thành công");
                router.push("/admin/login");
                router.refresh();
            } else {
                toast.error("Đăng xuất thất bại");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi đăng xuất");
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    return (
        <>
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
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className={styles.footerLink}
                    >
                        <LogOut size={18} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Xác nhận đăng xuất</h3>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className={styles.modalClose}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị không?</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className={`${styles.btn} ${styles.btnSecondary}`}
                                disabled={isLoggingOut}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleLogout}
                                className={`${styles.btn} ${styles.btnDanger}`}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
