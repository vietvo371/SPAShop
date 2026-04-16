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
  RotateCcw,
  Search,
  Filter,
  User,
  Hash,
  Save
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchLeads = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
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
  }, [statusFilter, searchTerm, selectedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchLeads(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

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
      case "NEW": return "Mới nhận";
      case "READ": return "Đang xử lý";
      case "REPLIED": return "Đã tư vấn";
      default: return status;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Khách Hàng Tư Vấn Quiz</h1>
          <p className={styles.pageSubtitle}>
            Theo dõi dữ liệu khách hàng tham gia khảo sát tư vấn liệu trình.
          </p>
        </div>
      </div>

      <div className={styles.inboxLayout}>
        {/* Left: Leads List Sidebar */}
        <aside className={styles.inboxList}>
          <div className={styles.inboxHeader}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <div className={styles.searchWrapper} style={{ width: "100%" }}>
                    <Search size={14} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm tên, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                        style={{ fontSize: "0.8rem", padding: "6px 10px 6px 30px" }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={styles.filterSelect}
                      style={{ padding: "4px 8px", fontSize: "0.75rem", minWidth: "120px" }}
                    >
                      <option value="all">Tất cả</option>
                      <option value="NEW">Mới nhận</option>
                      <option value="READ">Đang xử lý</option>
                      <option value="REPLIED">Đã tư vấn</option>
                    </select>
                    <span className={styles.inboxCount}>
                      {pagination.total || 0} khách
                    </span>
                </div>
            </div>
          </div>

          {loading && leads.length === 0 ? (
            <div className={styles.loadingState} style={{ padding: "40px 0" }}>
                <div className={styles.spinner}></div>
            </div>
          ) : (
            <div className={styles.inboxScroll}>
              {leads.length === 0 ? (
                <div className={styles.emptyState} style={{ padding: "40px 20px" }}>
                    <ClipboardList size={32} opacity="0.2" />
                    <p style={{ fontSize: "0.8rem" }}>Trống</p>
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
                      <div style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600, marginTop: "4px" }}>
                        Mục tiêu: {optionLabels[lead.answers?.goal] || "N/A"}
                      </div>
                      <span className={`${styles.badge} ${getStatusBadge(lead.status)}`} style={{ marginTop: "8px" }}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>
                ))
              )}

              {pagination.totalPages > 1 && (
                <div className={styles.pagination} style={{ padding: "15px", borderTop: "1px solid #eee" }}>
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchLeads(pagination.page - 1)}
                        className={styles.paginationBtn}
                        style={{ padding: "4px 8px" }}
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                        {pagination.page}/{pagination.totalPages}
                    </span>
                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchLeads(pagination.page + 1)}
                        className={styles.paginationBtn}
                        style={{ padding: "4px 8px" }}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right: Lead Detail View */}
        <main className={styles.inboxDetail}>
          {selectedLead ? (
            <div className={styles.detailContainer}>
              <div className={styles.detailHeader}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{selectedLead.name}</h2>
                    <span className={`${styles.badge} ${getStatusBadge(selectedLead.status)}`}>
                        {getStatusLabel(selectedLead.status)}
                    </span>
                  </div>
                  <div className={styles.contactInfo}>
                    <span className={styles.infoItem}>
                      <Phone size={14} /> <strong>{selectedLead.phone}</strong>
                    </span>
                    {selectedLead.email && (
                      <span className={styles.infoItem}>
                        <Mail size={14} /> {selectedLead.email}
                      </span>
                    )}
                    <span className={styles.infoItem}>
                      <Clock size={14} /> {new Date(selectedLead.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className={styles.detailActionsHeader}>
                    <a
                        href={`tel:${selectedLead.phone}`}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                        <Phone size={18} /> Liên hệ ngay
                    </a>
                </div>
              </div>

              <div className={styles.detailContent}>
                <h3 style={{ fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #eee" }}>
                    <ClipboardList size={18} /> Kết Quả Khảo Sát (Quiz Responses)
                </h3>
                
                <div className={styles.quizGrid}>
                    {Object.entries(questionLabels).map(([key, label]) => (
                        <div key={key} className={styles.quizCard}>
                            <div className={styles.quizLabel}>{label}</div>
                            <div className={styles.quizValue}>
                                {optionLabels[selectedLead.answers?.[key]] || selectedLead.answers?.[key] || "Chưa trả lời"}
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              <div className={styles.adminNoteSection}>
                <h3 style={{ fontSize: "0.9rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                    Lộ trình tư vấn & Ghi chú
                </h3>
                <textarea
                  placeholder="Nhập trạng thái sức khỏe, mong muốn hoặc lộ trình đã tư vấn cho khách..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className={styles.formTextarea}
                  rows={4}
                  style={{ width: "100%", marginBottom: "16px" }}
                />
                
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={() => handleUpdateStatus(selectedLead.id, selectedLead.status, adminNote)}
                    >
                      <Save size={18} /> Lưu ghi chú
                    </button>
                    
                    {selectedLead.status !== "REPLIED" && (
                        <button
                            className={`${styles.btn} ${styles.btnSuccess}`}
                            onClick={() => handleUpdateStatus(selectedLead.id, "REPLIED", adminNote)}
                        >
                            <CheckCircle size={16} /> Hoàn tất tư vấn
                        </button>
                    )}
                    
                    {selectedLead.status === "NEW" && (
                        <button
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            onClick={() => handleUpdateStatus(selectedLead.id, "READ")}
                        >
                            <AlertCircle size={16} /> Đánh dấu đang xử lý
                        </button>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <div style={{ textAlign: "center", opacity: 0.3 }}>
                <ClipboardList size={64} style={{ marginBottom: "16px" }} />
                <p>Chọn một phiếu khảo sát từ danh sách bên trái để xem kết quả tư vấn</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .inboxScroll {
            height: calc(100vh - 280px);
            overflow-y: auto;
        }
        .detailContainer {
            padding: 10px;
        }
        .infoItem {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.85rem;
            color: #666;
        }
        .contactInfo {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .detailHeader {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 1px solid #efefef;
        }
        .detailContent {
            margin-bottom: 30px;
        }
        .quizGrid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }
        @media (max-width: 1200px) {
            .quizGrid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        .quizCard {
            background: #f9fafb;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #eee;
            transition: all 0.2s;
        }
        .quizCard:hover {
            border-color: var(--color-primary);
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .quizLabel {
            font-size: 0.7rem;
            color: #9ca3af;
            text-transform: uppercase;
            font-weight: 700;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }
        .quizValue {
            font-weight: 600;
            color: #1f2937;
            font-size: 0.9rem;
            line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
