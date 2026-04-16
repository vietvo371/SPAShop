"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "../../admin.module.css";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  Clock, 
  ClipboardList, 
  CheckCircle,
  AlertCircle,
  RotateCcw
} from "lucide-react";

const questionLabels = {
  age: "Tuổi",
  target: "Vùng cần cải thiện",
  duration: "Tình trạng kéo dài",
  current_solution: "Cách xử lý hiện tại",
  free_time: "Thời gian rảnh",
  goal: "Mục tiêu lớn nhất"
};

const optionLabels = {
  // Age
  "under-25": "Dưới 25 tuổi",
  "25-35": "Từ 25 - 35 tuổi",
  "36-50": "Từ 36 - 50 tuổi",
  "over-50": "Trên 50 tuổi",
  // Target
  "face": "Da mặt (nếp nhăn, chảy xệ)",
  "eyes": "Vùng mắt (quầng thâm, nhức mỏi)",
  "neck": "Cổ, vai, gáy (đau nhức, căng cơ)",
  "body": "Toàn thân (tuần hoàn kém, mất ngủ)",
  // Duration
  "recent": "Mới xuất hiện gần đây",
  "mid": "Khoảng 1 - 3 tháng",
  "chronic": "Đã bị lâu năm (mãn tính)",
  // Solution
  "spa": "Tốn tiền đi Spa/Clinic định kỳ",
  "meds": "Dùng kem thoa/thuốc uống",
  "massage": "Massage bằng tay thông thường",
  "none": "Chưa có giải pháp nào",
  // Time
  "5-10": "Chỉ 5 - 10 phút (rất bận)",
  "15-30": "Khoảng 15 - 30 phút",
  "over-30": "Hơn 30 phút (thoải mái)",
  // Goal
  "rejuvenation": "Trẻ hóa, nâng cơ mặt rõ rệt",
  "pain-relief": "Hết hẳn đau nhức, nhẹ nhõm cơ thể",
  "circulation": "Lưu thông khí huyết, ngủ sâu giấc"
};

export default function ConsultationsAdminPage() {
  const [leads, setLeads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchLeads = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(filter !== "all" && { status: filter }),
      });

      const res = await fetch(`/api/consultation?${params}`);
      const result = await res.json();

      if (result.success) {
        setLeads(result.data);
        setPagination(result.pagination);
        if (result.data.length > 0 && !selectedId) {
          setSelectedId(result.data[0].id);
        }
      }
    } catch (error) {
      toast.error("Không thể tải danh sách khách tư vấn");
    } finally {
      setLoading(false);
    }
  }, [filter, selectedId]);

  useEffect(() => {
    fetchLeads(1);
  }, [filter, fetchLeads]);

  const selectedLead = leads.find(l => l.id === selectedId);

  useEffect(() => {
    if (selectedLead) {
      setAdminNote(selectedLead.note || "");
    }
  }, [selectedId, selectedLead]);

  const handleUpdateStatus = async (id, status, note = null) => {
    try {
      const res = await fetch(`/api/consultation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(note !== null && { note })
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã cập nhật thông tin");
        fetchLeads(pagination.page);
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "NEW": return styles.badgeNew;
      case "READ": return styles.badgeRead;
      case "REPLIED": return styles.badgeReplied;
      default: return "";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "NEW": return "Chưa xử lý";
      case "READ": return "Đang xử lý";
      case "REPLIED": return "Đã tư vấn";
      default: return status;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Khách Hàng Tư Vấn Quiz</h1>
      </div>

      <div className={styles.inboxLayout}>
        {/* Left: Leads List */}
        <aside className={styles.inboxList}>
          <div className={styles.inboxHeader}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              <option value="NEW">Chưa xử lý</option>
              <option value="READ">Đang xử lý</option>
              <option value="REPLIED">Đã tư vấn</option>
            </select>
            <span className={styles.inboxCount}>
              {leads.length} khách
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>
          ) : (
            <>
              {leads.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--color-gray)" }}>
                  Chưa có dữ liệu
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`${styles.inboxItem} ${lead.id === selectedId ? styles.selected : ""}`}
                    onClick={() => setSelectedId(lead.id)}
                  >
                    <div className={styles.inboxItemHeader}>
                      <strong>{lead.name}</strong>
                      <span className={styles.inboxTime}>
                        {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className={styles.inboxPhone}>{lead.phone}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-primary)", marginTop: "4px" }}>
                      Mục tiêu: {optionLabels[lead.answers?.goal] || "N/A"}
                    </div>
                    <span className={`${styles.badge} ${getStatusBadge(lead.status)}`} style={{ marginTop: "8px" }}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </div>
                ))
              )}

              {pagination.totalPages > 1 && (
                <div className={styles.pagination} style={{ padding: "10px" }}>
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchLeads(pagination.page - 1)}
                    className={styles.paginationBtn}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchLeads(pagination.page + 1)}
                    className={styles.paginationBtn}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </aside>

        {/* Right: Lead Detail */}
        <main className={styles.inboxDetail}>
          {selectedLead ? (
            <>
              <div className={styles.detailHeader}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)" }}>{selectedLead.name}</h2>
                  <div className={styles.contactInfo}>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Phone size={14} /> {selectedLead.phone}
                    </span>
                    {selectedLead.email && (
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Mail size={14} /> {selectedLead.email}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <span className={`${styles.badge} ${getStatusBadge(selectedLead.status)}`}>
                        {getStatusLabel(selectedLead.status)}
                    </span>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-gray)" }}>
                        Nhận lúc: {new Date(selectedLead.createdAt).toLocaleString("vi-VN")}
                    </div>
                </div>
              </div>

              <div className={styles.detailMessage}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <ClipboardList size={18} /> Kết Quả Tư Vấn (Quiz Responses)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {Object.entries(questionLabels).map(([key, label]) => (
                        <div key={key} style={{ 
                            background: "var(--color-cream)", 
                            padding: "15px", 
                            borderRadius: "10px",
                            border: "1px solid var(--color-light-gray)"
                        }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-gray)", textTransform: "uppercase", fontWeight: 700, marginBottom: "5px" }}>
                                {label}
                            </div>
                            <div style={{ fontWeight: 600, color: "var(--color-dark)" }}>
                                {optionLabels[selectedLead.answers?.[key]] || selectedLead.answers?.[key] || "Chưa trả lời"}
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              <div className={styles.adminNoteSection}>
                <h3>Ghi chú chăm sóc khách hàng</h3>
                <textarea
                  placeholder="Nhập trạng thái sức khỏe, mong muốn hoặc lộ trình đã tư vấn..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className={styles.adminNoteInput}
                  rows={5}
                />
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => handleUpdateStatus(selectedLead.id, selectedLead.status, adminNote)}
                >
                  💾 Lưu ghi chú
                </button>
              </div>

              <div className={styles.detailActions}>
                <div style={{ display: "flex", gap: "10px" }}>
                    {selectedLead.status === "NEW" && (
                        <button
                            className={`${styles.btn} ${styles.btnSuccess}`}
                            onClick={() => handleUpdateStatus(selectedLead.id, "READ")}
                        >
                            <AlertCircle size={16} /> Đánh dấu đang xử lý
                        </button>
                    )}
                    {selectedLead.status !== "REPLIED" && (
                        <button
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            onClick={() => handleUpdateStatus(selectedLead.id, "REPLIED")}
                        >
                            <CheckCircle size={16} /> Hoàn tất tư vấn
                        </button>
                    )}
                    {selectedLead.status !== "NEW" && (
                        <button
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            onClick={() => handleUpdateStatus(selectedLead.id, "NEW")}
                        >
                            <RotateCcw size={16} /> Đặt lại làm Mới
                        </button>
                    )}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      📞 Gọi điện ngay
                    </a>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyDetail}>
              <p>Chọn một phiếu tư vấn để xem chi tiết</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
