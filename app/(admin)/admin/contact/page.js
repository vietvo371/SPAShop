"use client";

import { useState } from "react";
import styles from "../admin.module.css";

const contacts = [
  { id: 1, name: "Phạm Thị D", phone: "0912345678", email: "phamthi.d@email.com", message: "Tôi muốn đặt lịch khám bệnh gout. Xin cho biết thời gian và chi phí?", status: "NEW", time: "10 phút trước" },
  { id: 2, name: "Hoàng Văn E", phone: "0987654321", email: "hoangvan.e@email.com", message: "Hỏi về sản phẩm đai lưng FIR. Có thể ship về Đà Nẵng không?", status: "READ", time: "30 phút trước" },
  { id: 3, name: "Vũ Thị F", phone: "0934567890", email: "vuthi.f@email.com", message: "Muốn biết giá dịch vụ phục hồi thận khí và thời gian đặt lịch.", status: "REPLIED", time: "1 giờ trước" },
  { id: 4, name: "Đặng Văn G", phone: "0978901234", email: "dangvan.g@email.com", message: "Tôi bị đau lưng kinh niên, muốn được tư vấn liệu trình phù hợp.", status: "NEW", time: "2 giờ trước" },
  { id: 5, name: "Bùi Thị H", phone: "0967890123", email: "buithi.h@email.com", message: "Hỏi về giờ làm việc và có cần đặt lịch trước không?", status: "READ", time: "3 giờ trước" },
];

export default function ContactAdminPage() {
  const [selectedId, setSelectedId] = useState(contacts[0]?.id || null);
  const [filter, setFilter] = useState("all");
  const [adminNote, setAdminNote] = useState("");

  const filteredContacts = contacts.filter(c => {
    if (filter === "unread") return c.status === "NEW";
    if (filter === "replied") return c.status === "REPLIED";
    return true;
  });

  const selectedContact = contacts.find(c => c.id === selectedId);

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

      {/* Inbox Layout */}
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
              {filteredContacts.length} tin nhắn
            </span>
          </div>

          {filteredContacts.map((contact) => (
            <div 
              key={contact.id}
              className={`${styles.inboxItem} ${contact.id === selectedId ? styles.selected : ""}`}
              onClick={() => setSelectedId(contact.id)}
            >
              <div className={styles.inboxItemHeader}>
                <strong>{contact.name}</strong>
                <span className={styles.inboxTime}>{contact.time}</span>
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
        </aside>

        {/* Right: Contact Detail */}
        <main className={styles.inboxDetail}>
          {selectedContact ? (
            <>
              <div className={styles.detailHeader}>
                <div>
                  <h2>{selectedContact.name}</h2>
                  <div className={styles.contactInfo}>
                    <span>📞 {selectedContact.phone}</span>
                    <span>✉️ {selectedContact.email}</span>
                  </div>
                </div>
                <span className={`${styles.badge} ${getStatusBadge(selectedContact.status)}`}>
                  {getStatusLabel(selectedContact.status)}
                </span>
              </div>

              <div className={styles.detailMessage}>
                <h3>Tin nhắn</h3>
                <p>{selectedContact.message}</p>
              </div>

              <div className={styles.adminNoteSection}>
                <h3>Ghi chú nội bộ</h3>
                <textarea 
                  placeholder="Nhập ghi chú cho admin..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className={styles.adminNoteInput}
                />
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => alert("Đã lưu ghi chú")}
                >
                  💾 Lưu ghi chú
                </button>
              </div>

              <div className={styles.detailActions}>
                <button 
                  className={`${styles.btn} ${styles.btnSuccess}`}
                  onClick={() => alert("Đã đánh dấu đã trả lời")}
                >
                  ✓ Đánh dấu đã trả lời
                </button>
                <a 
                  href={`tel:${selectedContact.phone}`}
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