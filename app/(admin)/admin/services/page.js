"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

const services = [
  { id: 1, name: "Khai thông vùng đầu", slug: "khai-thong-vung-dau", price: "350.000₫", duration: "60-90 phút", isActive: true },
  { id: 2, name: "Cổ vai gáy", slug: "co-vai-gay", price: "280.000₫", duration: "45-60 phút", isActive: true },
  { id: 3, name: "Thắt lưng eo", slug: "that-lung-eo", price: "320.000₫", duration: "50-70 phút", isActive: true },
  { id: 4, name: "Hông - Chân", slug: "hong-chan", price: "380.000₫", duration: "60-80 phút", isActive: true },
  { id: 5, name: "Bài độc gan", slug: "bai-doc-gan", price: "400.000₫", duration: "70-90 phút", isActive: true },
  { id: 6, name: "Phục hồi thận khí", slug: "phuc-hoi-than-khi", price: "450.000₫", duration: "75-90 phút", isActive: true },
  { id: 7, name: "Dưỡng phế", slug: "duong-phe", price: "280.000₫", duration: "45-60 phút", isActive: true },
  { id: 8, name: "Kiện tỳ vị", slug: "kien-tu-vi", price: "300.000₫", duration: "50-70 phút", isActive: true },
];

export default function ServicesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Quản lý Dịch vụ</h1>
        <Link href="/admin/services/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          + Thêm dịch vụ mới
        </Link>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm dịch vụ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
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
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>
                  <div className={styles.productName}>
                    <Link href={`/dich-vu-cham-soc/${service.slug}`} target="_blank">
                      {service.name}
                    </Link>
                  </div>
                </td>
                <td>{service.price}</td>
                <td>{service.duration}</td>
                <td>
                  <span className={`${styles.badge} ${service.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                    {service.isActive ? "Đang hiển thị" : "Đã ẩn"}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <Link href={`/admin/services/${service.id}`} className={styles.btnIcon} title="Sửa">
                      ✏️
                    </Link>
                    <button className={styles.btnIcon} title="Xóa" onClick={() => confirm("Bạn có chắc muốn xóa?")}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredServices.length === 0 && (
        <div className={styles.emptyState}>
          <p>Không tìm thấy dịch vụ nào</p>
        </div>
      )}
    </div>
  );
}