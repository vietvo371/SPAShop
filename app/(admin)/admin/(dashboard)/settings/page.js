"use client";

import { useState } from "react";
import styles from "../../admin.module.css";

const tabs = [
  { id: "general", label: "Thông tin cơ sở" },
  { id: "account", label: "Tài khoản" },
  { id: "banner", label: "Banner & Voucher" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    businessName: "Tâm An Energy Healing",
    address: "02 Phan Long Bằng, Quảng Ngãi",
    phone: "035 630 8211",
    email: "contact@chanan.vn",
    openHours: "Thứ 2 - Chủ nhật: 8:00 - 20:00",
    mapsUrl: "https://www.google.com/maps?q=02+Phan+Long+Băng,+Quảng+Ngãi&output=embed",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    voucherCode: "TAMAN50",
    voucherDiscount: "50",
    voucherExpiry: "2026-12-31",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveGeneral = () => {
    alert("Đã lưu thông tin cơ sở!");
  };

  const handleSavePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    alert("Đã đổi mật khẩu!");
  };

  const handleSaveVoucher = () => {
    alert("Đã lưu cài đặt voucher!");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Cài đặt</h1>
      </div>

      {/* Tabs */}
      <div className={styles.settingsTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.settingsContent}>
        {/* General Settings */}
        {activeTab === "general" && (
          <div className={styles.settingsSection}>
            <h2>Thông tin cơ sở</h2>
            <p className={styles.settingsDesc}>
              Cập nhật thông tin hiển thị trên website
            </p>

            <div className={styles.settingsForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên cơ sở</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Giờ mở cửa</label>
                  <input
                    type="text"
                    name="openHours"
                    value={formData.openHours}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Thứ 2 - Chủ nhật: 8:00 - 20:00"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Google Maps Embed URL</label>
                  <input
                    type="url"
                    name="mapsUrl"
                    value={formData.mapsUrl}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleSaveGeneral}
                >
                  💾 Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === "account" && (
          <div className={styles.settingsSection}>
            <h2>Tài khoản Admin</h2>
            <p className={styles.settingsDesc}>
              Đổi mật khẩu tài khoản quản trị
            </p>

            <div className={styles.settingsForm}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleSavePassword}
                >
                  🔒 Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banner & Voucher Settings */}
        {activeTab === "banner" && (
          <div className={styles.settingsSection}>
            <h2>Cài đặt Voucher</h2>
            <p className={styles.settingsDesc}>
              Quản lý mã voucher hiển thị trên website
            </p>

            <div className={styles.settingsForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mã voucher</label>
                  <input
                    type="text"
                    name="voucherCode"
                    value={formData.voucherCode}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Giảm giá (%)</label>
                  <input
                    type="number"
                    name="voucherDiscount"
                    value={formData.voucherDiscount}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    min="1"
                    max="100"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Ngày hết hạn</label>
                  <input
                    type="date"
                    name="voucherExpiry"
                    value={formData.voucherExpiry}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleSaveVoucher}
                >
                  💾 Lưu voucher
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .settingsTabs {
          display: flex;
          gap: 4px;
          background: white;
          padding: 4px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
          max-width: fit-content;
        }

        .tabBtn {
          padding: 10px 20px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: var(--transition);
        }

        .tabBtn:hover {
          background: #f3f4f6;
        }

        .tabBtn.active {
          background: var(--color-primary);
          color: white;
        }

        .settingsContent {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .settingsSection h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .settingsDesc {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }

        .settingsForm {
          max-width: 600px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .formGroup.fullWidth {
          grid-column: span 2;
        }

        .formLabel {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
        }

        .formInput {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: var(--transition);
        }

        .formInput:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(104, 10, 178, 0.1);
        }

        .formActions {
          display: flex;
          justify-content: flex-start;
        }

        @media (max-width: 768px) {
          .formGrid {
            grid-template-columns: 1fr;
          }
          
          .formGroup.fullWidth {
            grid-column: span 1;
          }

          .settingsTabs {
            flex-wrap: wrap;
          }

          .tabBtn {
            flex: 1;
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  );
}