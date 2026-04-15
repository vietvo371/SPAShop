"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";

const articles = [
  { id: 1, title: "Hồng ngoại xa (FIR) là gì?", slug: "hong-ngoai-xa-la-gi", category: "Kiến thức FIR", status: "PUBLISHED", date: "25/03/2026", views: 1250 },
  { id: 2, title: "5 cách chăm sóc sức khỏe tại nhà", slug: "cham-soc-suc-khoe-tai-nha-voi-fir", category: "Hướng dẫn", status: "PUBLISHED", date: "22/03/2026", views: 980 },
  { id: 3, title: "Điều trị Gout bằng hồng ngoại xa", slug: "dieu-tri-gout-bang-hong-ngoai-xa", category: "Sức khỏe", status: "PUBLISHED", date: "20/03/2026", views: 756 },
  { id: 4, title: "Vai trò của vi tuần hoàn máu", slug: "vai-tro-vi-tuan-hoan-mau", category: "Kiến thức FIR", status: "DRAFT", date: "18/03/2026", views: 654 },
  { id: 5, title: "12 Đường Kinh Lạc và ý nghĩa", slug: "12-duong-kinh-lac-y-hoc-co-truyen", category: "Y học cổ truyền", status: "PUBLISHED", date: "15/03/2026", views: 542 },
];

export default function ArticlesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED": return styles.badgeSuccess;
      case "DRAFT": return styles.badgePending;
      case "ARCHIVED": return styles.badgeInactive;
      default: return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PUBLISHED": return "Đã xuất bản";
      case "DRAFT": return "Bản nháp";
      case "ARCHIVED": return "Đã lưu trữ";
      default: return status;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Quản lý Bài viết</h1>
        <Link href="/admin/articles/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          + Viết bài mới
        </Link>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PUBLISHED">Đã xuất bản</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="ARCHIVED">Đã lưu trữ</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Ngày đăng</th>
              <th>Lượt xem</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id}>
                <td>
                  <Link href={`/kien-thuc/${article.slug}`} target="_blank" className={styles.articleTitle}>
                    {article.title}
                  </Link>
                </td>
                <td>{article.category}</td>
                <td>
                  <span className={`${styles.badge} ${getStatusBadge(article.status)}`}>
                    {getStatusLabel(article.status)}
                  </span>
                </td>
                <td>{article.date}</td>
                <td>{article.views.toLocaleString()}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <Link href={`/admin/articles/${article.id}`} className={styles.btnIcon} title="Sửa">
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

      {filteredArticles.length === 0 && (
        <div className={styles.emptyState}>
          <p>Không tìm thấy bài viết nào</p>
        </div>
      )}
    </div>
  );
}