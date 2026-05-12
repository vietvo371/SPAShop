"use client";

import { useState, useEffect } from "react";
import styles from "../../admin.module.css";
import { toast } from "sonner";
import {
  Save,
  Lock,
  Settings as SettingsIcon,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
  Image,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
} from "lucide-react";

const tabs = [
  { id: "general", label: "Thông tin cơ sở" },
  { id: "account", label: "Tài khoản" },
  { id: "banner", label: "Banner & Voucher" },
  { id: "sliders", label: "Slider trang chủ" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    phone: "",
    email: "",
    openHours: "",
    mapsUrl: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    voucherCode: "",
    voucherDiscount: "",
    voucherExpiry: "",
  });

  // Slider state
  const [sliders, setSliders] = useState([]);
  const [sliderLoading, setSliderLoading] = useState(false);
  const [showSliderForm, setShowSliderForm] = useState(false);
  const [editingSliderId, setEditingSliderId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sliderForm, setSliderForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    buttonText: "",
    orderIndex: 0,
    isActive: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const result = await res.json();
        if (result.success) {
          setFormData(prev => ({
            ...prev,
            ...result.data
          }));
        }
      } catch (error) {
        toast.error("Không thể tải cài đặt");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchSliders();
  }, []);

  // Slider functions
  const fetchSliders = async () => {
    setSliderLoading(true);
    try {
      const res = await fetch("/api/admin/sliders");
      const result = await res.json();
      if (result.success) {
        setSliders(result.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách slider");
    } finally {
      setSliderLoading(false);
    }
  };

  const resetSliderForm = () => {
    setSliderForm({ title: "", subtitle: "", imageUrl: "", linkUrl: "", buttonText: "", orderIndex: 0, isActive: true });
    setEditingSliderId(null);
    setShowSliderForm(false);
  };

  const handleEditSlider = (slider) => {
    setSliderForm({
      title: slider.title || "",
      subtitle: slider.subtitle || "",
      imageUrl: slider.imageUrl || "",
      linkUrl: slider.linkUrl || "",
      buttonText: slider.buttonText || "",
      orderIndex: slider.orderIndex || 0,
      isActive: slider.isActive,
    });
    setEditingSliderId(slider.id);
    setShowSliderForm(true);
  };

  const handleUploadSliderImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formDataUpload });
      const result = await res.json();
      if (result.success) {
        setSliderForm((prev) => ({ ...prev, imageUrl: result.url }));
        toast.success("Đã tải ảnh lên");
      } else {
        toast.error(result.error || "Tải ảnh thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi tải ảnh");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveSlider = async (e) => {
    e.preventDefault();
    if (!sliderForm.imageUrl.trim()) {
      toast.error("Vui lòng chọn hình ảnh cho slider");
      return;
    }

    setSaving(true);
    try {
      if (editingSliderId) {
        const res = await fetch(`/api/admin/sliders/${editingSliderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sliderForm),
        });
        const result = await res.json();
        if (result.success) {
          toast.success("Đã cập nhật slider");
          fetchSliders();
          resetSliderForm();
        } else {
          toast.error(result.error || "Lỗi khi cập nhật");
        }
      } else {
        const res = await fetch("/api/admin/sliders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sliderForm),
        });
        const result = await res.json();
        if (result.success) {
          toast.success("Đã tạo slider mới");
          fetchSliders();
          resetSliderForm();
        } else {
          toast.error(result.error || "Lỗi khi tạo slider");
        }
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlider = async (id) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSliders((prev) => prev.filter((s) => s.id !== id));
        toast.success("Đã xóa slider");
      } else {
        const result = await res.json();
        toast.error(result.error || "Không thể xóa slider");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (dataToSave, successMsg = "Đã lưu cài đặt!") => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(successMsg);
      } else {
        toast.error(result.error || "Lưu thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối máy chủ");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneral = () => {
    const { businessName, address, phone, email, openHours, mapsUrl } = formData;
    handleSave({ businessName, address, phone, email, openHours, mapsUrl }, "Đã lưu thông tin cơ sở!");
  };

  const handleSavePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã đổi mật khẩu thành công!");
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        toast.error(result.error || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi đổi mật khẩu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVoucher = () => {
    const { voucherCode, voucherDiscount, voucherExpiry } = formData;
    handleSave({ voucherCode, voucherDiscount, voucherExpiry }, "Đã lưu cài đặt voucher!");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Cài đặt hệ thống</h1>
          <p className={styles.pageSubtitle}>
            Quản lý thông tin doanh nghiệp, tài khoản và các thiết lập website.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.settingsTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {tab.id === "general" && <SettingsIcon size={16} />}
                {tab.id === "account" && <UserIcon size={16} />}
                {tab.id === "banner" && <CreditCard size={16} />}
                {tab.id === "sliders" && <Image size={16} />}
                {tab.label}
            </div>
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
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
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
                  disabled={saving}
                >
                  <ShieldCheck size={18} />
                  {saving ? "Đang xử lý..." : "Đổi mật khẩu"}
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
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? "Đang lưu..." : "Lưu voucher"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sliders Settings */}
        {activeTab === "sliders" && (
          <div className={styles.settingsSection}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h2>Slider trang chủ</h2>
                <p className={styles.settingsDesc}>
                  Quản lý banner/slider hiển thị trên trang chủ
                </p>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  resetSliderForm();
                  setShowSliderForm(!showSliderForm);
                }}
              >
                <Plus size={18} />
                Thêm slider
              </button>
            </div>

            {/* Add/Edit Slider Form */}
            {showSliderForm && (
              <div className={styles.card} style={{ marginBottom: "24px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                    {editingSliderId ? "Chỉnh sửa slider" : "Thêm slider mới"}
                  </h3>
                  <button onClick={resetSliderForm} className={styles.modalClose}>
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSaveSlider}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tiêu đề</label>
                      <input
                        type="text"
                        value={sliderForm.title}
                        onChange={(e) => setSliderForm((prev) => ({ ...prev, title: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Tiêu đề chính"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phụ đề</label>
                      <input
                        type="text"
                        value={sliderForm.subtitle}
                        onChange={(e) => setSliderForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Mô tả ngắn"
                      />
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.formLabel}>Hình ảnh</label>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input
                          type="text"
                          value={sliderForm.imageUrl}
                          onChange={(e) => setSliderForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                          className={styles.formInput}
                          placeholder="URL hình ảnh"
                          style={{ flex: 1 }}
                        />
                        <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                          <Upload size={16} />
                          {uploadingImage ? "Đang tải..." : "Tải ảnh"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadSliderImage}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                      {sliderForm.imageUrl && (
                        <img
                          src={sliderForm.imageUrl}
                          alt="Preview"
                          style={{ marginTop: "8px", maxWidth: "300px", maxHeight: "150px", borderRadius: "8px", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>URL liên kết</label>
                      <input
                        type="text"
                        value={sliderForm.linkUrl}
                        onChange={(e) => setSliderForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
                        className={styles.formInput}
                        placeholder="/san-pham/..."
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Nút bấm</label>
                      <input
                        type="text"
                        value={sliderForm.buttonText}
                        onChange={(e) => setSliderForm((prev) => ({ ...prev, buttonText: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Xem ngay"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Thứ tự</label>
                      <input
                        type="number"
                        value={sliderForm.orderIndex}
                        onChange={(e) => setSliderForm((prev) => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="checkbox"
                          checked={sliderForm.isActive}
                          onChange={(e) => setSliderForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        />
                        Hiển thị
                      </label>
                    </div>
                  </div>
                  <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
                      <Save size={18} />
                      {saving ? "Đang lưu..." : editingSliderId ? "Cập nhật" : "Tạo mới"}
                    </button>
                    <button type="button" onClick={resetSliderForm} className={`${styles.btn} ${styles.btnSecondary}`}>
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Sliders List */}
            {sliderLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Đang tải...</p>
              </div>
            ) : sliders.length === 0 ? (
              <div className={styles.emptyState}>
                <Image size={48} opacity="0.3" />
                <p>Chưa có slider nào</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: "120px" }}>Hình ảnh</th>
                      <th>Tiêu đề</th>
                      <th>Thứ tự</th>
                      <th>Trạng thái</th>
                      <th style={{ width: "120px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sliders.map((slider) => (
                      <tr key={slider.id}>
                        <td>
                          <div className={styles.productImage} style={{ width: "80px", height: "50px" }}>
                            <img src={slider.imageUrl} alt={slider.title || "Slider"} className={styles.thumbnail} />
                          </div>
                        </td>
                        <td>
                          <div className={styles.productName}>{slider.title || "Không tiêu đề"}</div>
                          {slider.subtitle && <div className={styles.productSlug}>{slider.subtitle}</div>}
                        </td>
                        <td>{slider.orderIndex}</td>
                        <td>
                          {slider.isActive ? (
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>Hiển thị</span>
                          ) : (
                            <span className={`${styles.badge} ${styles.badgeDefault}`}>Ẩn</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              onClick={() => handleEditSlider(slider)}
                              className={styles.actionBtn}
                              title="Chỉnh sửa"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSlider(slider.id)}
                              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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