"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import styles from "../../admin.module.css";
import { toast } from "sonner";

export default function ServicesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const result = await res.json();
      if (result.success) {
        setServices(result.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã xóa dịch vụ");
        fetchServices();
      } else {
        toast.error(result.error || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa dịch vụ");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Quản lý Dịch vụ</h1>
        <Link href="/admin/services/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          <Plus size={18} /> Thêm dịch vụ mới
        </Link>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải dịch vụ...</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Giá</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className={styles.productName}>
                        <Link href={`/dich-vu-cham-soc/${service.slug}`} target="_blank">
                          {service.name}
                        </Link>
                      </div>
                    </td>
                    <td>{formatPrice(service.price)}</td>
                    <td>{service.duration || "N/A"}</td>
                    <td>
                      <span className={`${styles.badge} ${service.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                        {service.isActive ? "Đang hiển thị" : "Đã ẩn"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <Link href={`/admin/services/${service.id}`} className={styles.btnIcon} title="Sửa">
                          <Pencil size={16} />
                        </Link>
                        <button
                          className={styles.btnIcon}
                          title="Xóa"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
                    Không tìm thấy dịch vụ nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}