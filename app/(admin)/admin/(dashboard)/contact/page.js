"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "../../admin.module.css";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Mail, Phone, Clock, MessageSquare } from "lucide-react";

export default function ContactAdminPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchContacts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(filter !== "all" && { status: filter === "unread" ? "NEW" : "REPLIED" }),
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
  }, [filter, selectedId]);

  useEffect(() => {
    fetchContacts(1);
  }, [filter]);

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
      case "READ": return "Đã đọc";
      case "REPLIED": return "Đã trả lời";
      default: return status;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Hộp thư Liên hệ</h1>
      </div>

      <div className={styles.inboxLayout}>
        {/* Left: Contact List */}
        <aside className={styles.inboxList}>
          <div className={styles.inboxHeader}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              <option value="unread">Chưa đọc</option>
              <option value="replied">Đã trả lời</option>
            </select>
            <span className={styles.inboxCount}>
              {contacts.length} tin nhắn
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>Đang tải...</div>
          ) : (
            <>
              {contacts.map((contact) => (
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
                    {contact.message.slice(0, 50)}...
                  </p>
                  <span className={`${styles.badge} ${getStatusBadge(contact.status)}`}>
                    {getStatusLabel(contact.status)}
                  </span>
                </div>
              ))}

              {pagination.totalPages > 1 && (
                <div className={styles.pagination} style={{ padding: "10px" }}>
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchContacts(pagination.page - 1)}
                    className={styles.paginationBtn}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchContacts(pagination.page + 1)}
                    className={styles.paginationBtn}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </aside>

        {/* Right: Contact Detail */}
        <main className={styles.inboxDetail}>
          {selectedContact ? (
            <>
              <div className={styles.detailHeader}>
                <div>
                  <h2>{selectedContact.name}</h2>
                  <div className={styles.contactInfo}>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Phone size={14} /> {selectedContact.customerPhone || selectedContact.phone}
                    </span>
                    {selectedContact.email && (
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Mail size={14} /> {selectedContact.email}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`${styles.badge} ${getStatusBadge(selectedContact.status)}`}>
                  {getStatusLabel(selectedContact.status)}
                </span>
              </div>

              <div className={styles.detailMessage}>
                <h3><MessageSquare size={16} /> Tin nhắn</h3>
                <p>{selectedContact.message}</p>
                <div style={{ marginTop: "10px", fontSize: "0.8rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Clock size={12} /> Nhận lúc: {new Date(selectedContact.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <div className={styles.adminNoteSection}>
                <h3>Ghi chú nội bộ</h3>
                <textarea
                  placeholder="Nhập ghi chú hoặc nội dung phản hồi..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className={styles.adminNoteInput}
                />
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => handleUpdateStatus(selectedContact.id, selectedContact.status, adminNote)}
                >
                  💾 Lưu ghi chú
                </button>
              </div>

              <div className={styles.detailActions}>
                {selectedContact.status !== "REPLIED" && (
                  <button
                    className={`${styles.btn} ${styles.btnSuccess}`}
                    onClick={() => handleUpdateStatus(selectedContact.id, "REPLIED")}
                  >
                    ✓ Đánh dấu đã trả lời
                  </button>
                )}
                <a
                  href={`tel:${selectedContact.customerPhone || selectedContact.phone}`}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  📞 Gọi điện
                </a>
              </div>
            </>
          ) : (
            <div className={styles.emptyDetail}>
              <p>Chọn một tin nhắn để xem chi tiết</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}