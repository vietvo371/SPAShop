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
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Hash,
  Save
} from "lucide-react";

export default function ContactAdminPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchContacts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(filter !== "all" && { status: filter === "unread" ? "NEW" : "REPLIED" }),
        ...(searchTerm && { search: searchTerm }),
      });

      const res = await fetch(`/api/contact?${params}`);
      const result = await res.json();

      if (result.success) {
        setContacts(result.data);
        setPagination(result.pagination);
        if (result.data.length > 0 && !selectedId) {
          setSelectedId(result.data[0].id);
        }
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tin nhắn");
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm, selectedId]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchContacts(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  const selectedContact = contacts.find(c => c.id === selectedId);

  useEffect(() => {
    if (selectedContact) {
      setAdminNote(selectedContact.replyNote || "");
    }
  }, [selectedId, selectedContact]);

  const handleUpdateStatus = async (id, status, note = null) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(note !== null && { replyNote: note })
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Đã cập nhật tin nhắn");
        fetchContacts(pagination.page);
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
      case "NEW": return "Mới";
      case "READ": return "Đang đọc";
      case "REPLIED": return "Đã xử lý";
      default: return status;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Hộp thư Liên hệ</h1>
          <p className={styles.pageSubtitle}>
            Quản lý và phản hồi tin nhắn từ khách hàng qua website.
          </p>
        </div>
      </div>

      <div className={styles.inboxLayout}>
        {/* Left: Contact List */}
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
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={styles.filterSelect}
                        style={{ padding: "4px 8px", fontSize: "0.75rem", minWidth: "120px" }}
                    >
                        <option value="all">Tất cả</option>
                        <option value="unread">Chưa đọc</option>
                        <option value="replied">Đã xử lý</option>
                    </select>
                    <span className={styles.inboxCount}>
                        {pagination.total || 0} tin nhắn
                    </span>
                </div>
            </div>
          </div>

          {loading && contacts.length === 0 ? (
            <div className={styles.loadingState} style={{ padding: "40px 0" }}>
                <div className={styles.spinner}></div>
            </div>
          ) : (
            <div className={styles.inboxScroll}>
              {contacts.length === 0 ? (
                <div className={styles.emptyState} style={{ padding: "40px 20px" }}>
                    <MessageSquare size={32} opacity="0.2" />
                    <p style={{ fontSize: "0.8rem" }}>Trống</p>
                </div>
              ) : (
                contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`${styles.inboxItem} ${contact.id === selectedId ? styles.selected : ""}`}
                      onClick={() => setSelectedId(contact.id)}
                    >
                      <div className={styles.inboxItemHeader}>
                        <strong>{contact.name}</strong>
                        <span className={styles.inboxTime}>
                          {new Date(contact.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className={styles.inboxPhone}>{contact.phone}</div>
                      <p className={styles.inboxPreview}>
                        {contact.message.slice(0, 50)}{contact.message.length > 50 ? "..." : ""}
                      </p>
                      <span className={`${styles.badge} ${getStatusBadge(contact.status)}`} style={{ marginTop: "8px" }}>
                        {getStatusLabel(contact.status)}
                      </span>
                    </div>
                ))
              )}

              {pagination.totalPages > 1 && (
                <div className={styles.pagination} style={{ padding: "15px", borderTop: "1px solid #eee" }}>
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchContacts(pagination.page - 1)}
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
                    onClick={() => fetchContacts(pagination.page + 1)}
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

        {/* Right: Contact Detail */}
        <main className={styles.inboxDetail}>
          {selectedContact ? (
            <div className={styles.detailContainer}>
              <div className={styles.detailHeader}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{selectedContact.name}</h2>
                    <span className={`${styles.badge} ${getStatusBadge(selectedContact.status)}`}>
                        {getStatusLabel(selectedContact.status)}
                    </span>
                  </div>
                  <div className={styles.contactInfo}>
                    <span className={styles.infoItem}>
                      <Phone size={14} /> <strong>{selectedContact.customerPhone || selectedContact.phone}</strong>
                    </span>
                    {selectedContact.email && (
                      <span className={styles.infoItem}>
                        <Mail size={14} /> {selectedContact.email}
                      </span>
                    )}
                    <span className={styles.infoItem}>
                      <Clock size={14} /> {new Date(selectedContact.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className={styles.detailActionsHeader}>
                    <a
                        href={`tel:${selectedContact.customerPhone || selectedContact.phone}`}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                        <Phone size={18} /> Gọi điện
                    </a>
                </div>
              </div>

              <div className={styles.card} style={{ border: "none", boxShadow: "none", background: "#f9fafb", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                    <MessageSquare size={18} /> Nội dung tin nhắn
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", whiteSpace: "pre-wrap", color: "#374151" }}>
                    {selectedContact.message}
                </p>
              </div>

              <div className={styles.adminNoteSection}>
                <h3 style={{ fontSize: "0.9rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                    Xử lý & Ghi chú nội bộ
                </h3>
                <textarea
                  placeholder="Nhập nội dung đã trao đổi với khách hoặc ghi chú theo dõi..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className={styles.formTextarea}
                  rows={4}
                  style={{ width: "100%", marginBottom: "16px" }}
                />
                
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={() => handleUpdateStatus(selectedContact.id, selectedContact.status, adminNote)}
                    >
                        <Save size={18} /> Lưu ghi chú
                    </button>
                    
                    {selectedContact.status !== "REPLIED" && (
                        <button
                            className={`${styles.btn} ${styles.btnSuccess}`}
                            onClick={() => handleUpdateStatus(selectedContact.id, "REPLIED", adminNote)}
                        >
                            <CheckCircle size={16} /> Đánh dấu đã xử lý
                        </button>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <div style={{ textAlign: "center", opacity: 0.3 }}>
                <Mail size={64} style={{ marginBottom: "16px" }} />
                <p>Chọn một tin nhắn từ danh sách bên trái để xem nội dung chi tiết</p>
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
      `}</style>
    </div>
  );
}