"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cross, ArrowLeft } from "lucide-react";
import styles from "./login.module.css";

import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Đăng nhập thành công! Đang chuyển hướng...");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.error || "Đăng nhập thất bại");
      }
    } catch {
      toast.error("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Cross className={styles.logo} size={48} />
          <h1>Tâm An Admin</h1>
          <p>Đăng nhập để quản lý hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@chanan.vn"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Quay về trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}