"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "../../admin.module.css";
import { toast } from "sonner";
import {
  Save,
  Lock,
  Settings as SettingsIcon,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ExternalLink,
  MapPin,
  Clock,
  Mail,
  Phone
} from "lucide-react";

const tabs = [
  { id: "general", label: "Thông tin cơ sở", icon: SettingsIcon },
  { id: "account", label: "Tài khoản", icon: Lock },
  { id: "banner", label: "Banner & Voucher", icon: CreditCard },
  { id: "sliders", label: "Slider trang chủ", icon: ImageIcon },
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
  const [dragActive, setDragActive] = useState(false);
  
  const [sliderForm, setSliderForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    buttonText: "",
    orderIndex: 0,
    isActive: true,
  });

  const fetchSettings = useCallback(async () => {
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
  }, []);

  const fetchSliders = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchSliders();
  }, [fetchSettings, fetchSliders]);

  const resetSliderForm = () => {
    setSliderForm({ 
      title: "", 
      subtitle: "", 
      imageUrl: "", 
      linkUrl: "", 
      buttonText: "", 
      orderIndex: 0, 
      isActive: true 
    });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUploadFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File quá lớn (tối đa 5MB)");
      return;
    }

    setUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();
      
      if (result.success) {
        setSliderForm(prev => ({ ...prev, imageUrl: result.url }));
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error(result.error || "Tải ảnh thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
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
      const url = editingSliderId 
        ? `/api/admin/sliders/${editingSliderId}` 
        : "/api/admin/sliders";
      const method = editingSliderId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sliderForm),
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success(editingSliderId ? "Đã cập nhật slider" : "Đã tạo slider mới");
        fetchSliders();
        resetSliderForm();
      } else {
        toast.error(result.error || "Lỗi hệ thống");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlider = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa slider này?")) return;
    
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

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Đang tải cài đặt...</p>
      </div>
    );
  }

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

      <div className="settingsGrid">
        {/* Sidebar Tabs */}
        <aside className="settingsSidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`sidebarTab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="settingsMain">
          <div className={styles.card}>
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="sectionContent">
                <div className="sectionHeader">
                  <h2>Thông tin cơ sở</h2>
                  <p>Cập nhật thông tin hiển thị trên website, Google Maps và chân trang.</p>
                </div>

                <div className="formGrid">
                  <div className="formGroup">
                    <label><SettingsIcon size={14} /> Tên cơ sở</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Tâm An Beauty & Spa"
                    />
                  </div>

                  <div className="formGroup">
                    <label><Phone size={14} /> Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="090..."
                    />
                  </div>

                  <div className="formGroup">
                    <label><Mail size={14} /> Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@taman.com"
                    />
                  </div>

                  <div className="formGroup">
                    <label><Clock size={14} /> Giờ mở cửa</label>
                    <input
                      type="text"
                      name="openHours"
                      value={formData.openHours}
                      onChange={handleInputChange}
                      placeholder="Thứ 2 - Chủ nhật: 8:00 - 20:00"
                    />
                  </div>

                  <div className="formGroup fullWidth">
                    <label><MapPin size={14} /> Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Đường ABC, Quận XYZ..."
                    />
                  </div>

                  <div className="formGroup fullWidth">
                    <label><ExternalLink size={14} /> Google Maps Embed URL</label>
                    <input
                      type="url"
                      name="mapsUrl"
                      value={formData.mapsUrl}
                      onChange={handleInputChange}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <small>Dùng để hiển thị bản đồ trên trang liên hệ.</small>
                  </div>
                </div>

                <div className="sectionActions">
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
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="sectionContent">
                <div className="sectionHeader">
                  <h2>Bảo mật tài khoản</h2>
                  <p>Thay đổi mật khẩu đăng nhập vào trang quản trị.</p>
                </div>

                <div className="formGrid narrow">
                  <div className="formGroup fullWidth">
                    <label><Lock size={14} /> Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="formGroup fullWidth">
                    <label><ShieldCheck size={14} /> Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="formGroup fullWidth">
                    <label><ShieldCheck size={14} /> Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="sectionActions">
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleSavePassword}
                    disabled={saving}
                  >
                    <Lock size={18} />
                    {saving ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </button>
                </div>
              </div>
            )}

            {/* Banner & Voucher Settings */}
            {activeTab === "banner" && (
              <div className="sectionContent">
                <div className="sectionHeader">
                  <h2>Cấu hình Voucher</h2>
                  <p>Quản lý mã khuyến mãi hiển thị trên các banner quảng bá.</p>
                </div>

                <div className="formGrid narrow">
                  <div className="formGroup fullWidth">
                    <label><CreditCard size={14} /> Mã Voucher</label>
                    <input
                      type="text"
                      name="voucherCode"
                      value={formData.voucherCode}
                      onChange={handleInputChange}
                      placeholder="TAMAN20"
                    />
                  </div>

                  <div className="formGroup fullWidth">
                    <label>Phần trăm giảm giá (%)</label>
                    <input
                      type="number"
                      name="voucherDiscount"
                      value={formData.voucherDiscount}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                    />
                  </div>

                  <div className="formGroup fullWidth">
                    <label>Ngày hết hạn</label>
                    <input
                      type="date"
                      name="voucherExpiry"
                      value={formData.voucherExpiry}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="sectionActions">
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleSaveVoucher}
                    disabled={saving}
                  >
                    <Save size={18} />
                    {saving ? "Đang lưu..." : "Cập nhật Voucher"}
                  </button>
                </div>
              </div>
            )}

            {/* Sliders Settings */}
            {activeTab === "sliders" && (
              <div className="sectionContent">
                <div className="sectionHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h2>Slider trang chủ</h2>
                    <p>Quản lý các banner lớn trình chiếu trên trang chủ website.</p>
                  </div>
                  {!showSliderForm && (
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={() => {
                        resetSliderForm();
                        setShowSliderForm(true);
                      }}
                    >
                      <Plus size={18} /> Thêm Slider
                    </button>
                  )}
                </div>

                {/* Slider Form */}
                {showSliderForm && (
                  <div className="sliderFormBox">
                    <div className="boxHeader">
                      <h3>{editingSliderId ? "Chỉnh sửa Slider" : "Tạo Slider mới"}</h3>
                      <button className="iconBtn" onClick={resetSliderForm}><X size={20} /></button>
                    </div>
                    
                    <form onSubmit={handleSaveSlider}>
                      <div className="formGrid">
                        <div className="formGroup">
                          <label>Tiêu đề chính</label>
                          <input
                            type="text"
                            value={sliderForm.title}
                            onChange={(e) => setSliderForm({...sliderForm, title: e.target.value})}
                            placeholder="Chào mừng đến với Tâm An"
                          />
                        </div>
                        <div className="formGroup">
                          <label>Phụ đề</label>
                          <input
                            type="text"
                            value={sliderForm.subtitle}
                            onChange={(e) => setSliderForm({...sliderForm, subtitle: e.target.value})}
                            placeholder="Nơi thư giãn tuyệt vời cho tâm hồn"
                          />
                        </div>
                        
                        <div className="formGroup fullWidth">
                          <label>Hình ảnh Banner</label>
                          <div 
                            className={`dropZone ${dragActive ? "active" : ""} ${sliderForm.imageUrl ? "hasImage" : ""}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                          >
                            {sliderForm.imageUrl ? (
                              <div className="imagePreview">
                                <img src={sliderForm.imageUrl} alt="Slider" />
                                <button type="button" className="removeImg" onClick={() => setSliderForm({...sliderForm, imageUrl: ""})}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="uploadPrompt">
                                <Upload size={32} />
                                <p>Kéo thả ảnh vào đây hoặc click để chọn</p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleUploadFile(e.target.files[0])}
                                />
                              </div>
                            )}
                            {uploadingImage && <div className="uploadingOverlay"><div className={styles.spinner}></div></div>}
                          </div>
                        </div>

                        <div className="formGroup">
                          <label>Đường dẫn (Link)</label>
                          <input
                            type="text"
                            value={sliderForm.linkUrl}
                            onChange={(e) => setSliderForm({...sliderForm, linkUrl: e.target.value})}
                            placeholder="/dich-vu"
                          />
                        </div>
                        <div className="formGroup">
                          <label>Tên nút bấm</label>
                          <input
                            type="text"
                            value={sliderForm.buttonText}
                            onChange={(e) => setSliderForm({...sliderForm, buttonText: e.target.value})}
                            placeholder="Khám phá ngay"
                          />
                        </div>
                        <div className="formGroup">
                          <label>Thứ tự hiển thị</label>
                          <input
                            type="number"
                            value={sliderForm.orderIndex}
                            onChange={(e) => setSliderForm({...sliderForm, orderIndex: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="formGroup">
                          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "32px", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={sliderForm.isActive}
                              onChange={(e) => setSliderForm({...sliderForm, isActive: e.target.checked})}
                            />
                            Kích hoạt hiển thị
                          </label>
                        </div>
                      </div>
                      
                      <div className="formActions">
                        <button type="button" className="cancelBtn" onClick={resetSliderForm}>Hủy bỏ</button>
                        <button type="submit" className="submitBtn" disabled={saving}>
                          <Save size={18} /> {saving ? "Đang lưu..." : "Lưu Slider"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Sliders Table */}
                {!showSliderForm && (
                  <div className={styles.tableWrapper}>
                    {sliderLoading ? (
                      <div className="tableLoading"><div className={styles.spinner}></div></div>
                    ) : sliders.length === 0 ? (
                      <div className={styles.emptyState}>
                        <ImageIcon size={48} opacity="0.3" />
                        <p>Chưa có slider nào được tạo.</p>
                      </div>
                    ) : (
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th style={{ width: "160px" }}>Hình ảnh</th>
                            <th>Nội dung</th>
                            <th>Thứ tự</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: "right" }}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sliders.map((slider) => (
                            <tr key={slider.id}>
                              <td>
                                <img src={slider.imageUrl} alt={slider.title} className="sliderThumb" />
                              </td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{slider.title || "(Không tiêu đề)"}</div>
                                <div style={{ fontSize: "0.8rem", color: "#666" }}>{slider.subtitle}</div>
                              </td>
                              <td>{slider.orderIndex}</td>
                              <td>
                                <span className={`${styles.badge} ${slider.isActive ? styles.badgeSuccess : styles.badgeInactive}`}>
                                  {slider.isActive ? "Hiển thị" : "Ẩn"}
                                </span>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div className={styles.actionButtons} style={{ justifyContent: "flex-end" }}>
                                  <button className={styles.actionBtn} onClick={() => handleEditSlider(slider)} title="Sửa">
                                    <Pencil size={16} />
                                  </button>
                                  <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => handleDeleteSlider(slider.id)} title="Xóa">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .settingsGrid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
          align-items: flex-start;
        }

        .settingsSidebar {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: white;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          position: sticky;
          top: 24px;
        }

        .sidebarTab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: #4b5563;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .sidebarTab:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .sidebarTab.active {
          background: var(--color-primary);
          color: white;
        }

        .sectionContent {
          padding: 8px;
        }

        .sectionHeader {
          margin-bottom: 32px;
        }

        .sectionHeader h2 {
          margin: 0 0 8px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .sectionHeader p {
          margin: 0;
          color: #6b7280;
          font-size: 0.95rem;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .formGrid.narrow {
          max-width: 500px;
          grid-template-columns: 1fr;
        }

        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .formGroup.fullWidth {
          grid-column: span 2;
        }
        
        .formGrid.narrow .formGroup.fullWidth {
          grid-column: span 1;
        }

        .formGroup label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .formGroup input, .formGroup select, .formGroup textarea {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .formGroup input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(104, 10, 178, 0.1);
        }

        .formGroup small {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .sectionActions {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }

        /* Slider Form Box */
        .sliderFormBox {
          background: #f9fafb;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          margin-bottom: 32px;
        }

        .boxHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .boxHeader h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .iconBtn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }

        .dropZone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          transition: all 0.2s;
          position: relative;
          background: white;
        }

        .dropZone.active {
          border-color: var(--color-primary);
          background: rgba(104, 10, 178, 0.05);
        }

        .dropZone.hasImage {
          padding: 12px;
          border-style: solid;
        }

        .uploadPrompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6b7280;
        }

        .uploadPrompt input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .imagePreview {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .imagePreview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .removeImg {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .removeImg:hover {
          transform: scale(1.1);
          background: #dc2626;
        }

        .uploadingOverlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .formActions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .cancelBtn {
          padding: 10px 20px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .submitBtn {
          padding: 10px 24px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sliderThumb {
          width: 120px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #eee;
        }

        .tableLoading {
          padding: 60px;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .settingsGrid {
            grid-template-columns: 1fr;
          }
          .settingsSidebar {
            flex-direction: row;
            overflow-x: auto;
            position: static;
          }
          .sidebarTab {
            white-space: nowrap;
          }
        }

        @media (max-width: 768px) {
          .formGrid {
            grid-template-columns: 1fr;
          }
          
          .formGroup.fullWidth {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}