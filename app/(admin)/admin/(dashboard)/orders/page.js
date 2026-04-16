"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    ShoppingCart,
    Search,
    Eye,
    X,
    User,
    Phone,
    MapPin,
    CreditCard,
    Hash,
    ChevronLeft,
    ChevronRight,
    XCircle
} from "lucide-react";
import { toast } from "sonner";
import styles from "../../admin.module.css";
import { formatPrice } from "@/app/lib/utils";

const statusMap = {
    PENDING: { label: "Mới", color: "#3b82f6", bg: "#eff6ff" },
    CONFIRMED: { label: "Đã chốt", color: "#f59e0b", bg: "#fffbeb" },
    SHIPPING: { label: "Đang giao", color: "#8b5cf6", bg: "#f5f3ff" },
    COMPLETED: { label: "Thành công", color: "#10b981", bg: "#ecfdf5" },
    CANCELLED: { label: "Đã hủy", color: "#ef4444", bg: "#fef2f2" },
};

const paymentMethodMap = {
    COD: "Thanh toán khi nhận hàng",
    TRANSFER: "Chuyển khoản ngân hàng",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [staffNote, setStaffNote] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const url = `/api/orders?status=${filter}&search=${searchTerm}`;
            const res = await fetch(url);
            const result = await res.json();
            if (result.success) {
                setOrders(result.data);
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders();
    };

    const updateOrderStatus = async (id, status) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, staffNote }),
            });
            const result = await res.json();
            if (result.success) {
                toast.success("Cập nhật trạng thái thành công");
                fetchOrders();
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder({ ...selectedOrder, status, staffNote });
                }
            } else {
                toast.error(result.error || "Cập nhật thất bại");
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Quản lý Đơn hàng</h1>
                    <p className={styles.pageSubtitle}>Theo dõi và xử lý các yêu cầu đặt hàng.</p>
                </div>
            </div>

            {/* Filter Card */}
            <div className={styles.card} style={{ marginBottom: "24px" }}>
                <form onSubmit={handleSearch} className={styles.filterForm}>
                    <div className={styles.filterRow}>
                        <div className={styles.searchWrapper}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Tìm mã đơn, tên, điện thoại..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <select
                            className={styles.filterSelect}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">Tất cả trạng thái</option>
                            {Object.entries(statusMap).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        <button type="submit" className={`${styles.btn} ${styles.btnSecondary}`}>
                            Tìm kiếm
                        </button>
                    </div>
                </form>
            </div>

            {/* Orders Table Card */}
            <div className={styles.card}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <ShoppingCart size={48} opacity={0.3} />
                        <p>Không có đơn hàng nào được tìm thấy.</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Khách hàng</th>
                                    <th>Tổng đơn</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày đặt</th>
                                    <th style={{ width: "80px", textAlign: "right" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <span style={{ fontWeight: 700, color: "#333" }}>#{order.orderNumber}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontWeight: 600 }}>{order.customerName}</span>
                                                <span style={{ fontSize: "0.8rem", color: "#666" }}>{order.customerPhone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                                                {formatPrice(order.totalAmount)}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    backgroundColor: statusMap[order.status]?.bg,
                                                    color: statusMap[order.status]?.color,
                                                }}
                                            >
                                                {statusMap[order.status]?.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setStaffNote(order.staffNote || "");
                                                }}
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modal} style={{ maxWidth: "800px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Hash size={18} />
                                Đơn hàng #{selectedOrder.orderNumber}
                            </h3>
                            <button className={styles.modalClose} onClick={() => setSelectedOrder(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody} style={{ maxHeight: "80vh", overflowY: "auto" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
                                {/* Customer Section */}
                                <div>
                                    <h4 style={{ fontSize: "0.9rem", color: "#999", textTransform: "uppercase", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Thông tin khách hàng</h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <User size={16} color="#666" />
                                            <span style={{ fontWeight: 600 }}>{selectedOrder.customerName}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <Phone size={16} color="#666" />
                                            <span>{selectedOrder.customerPhone}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                            <MapPin size={16} color="#666" style={{ marginTop: "3px" }} />
                                            <div style={{ fontSize: "0.9rem", color: "#444" }}>
                                                <p>{selectedOrder.customerAddress}</p>
                                                <p>{selectedOrder.ward}, {selectedOrder.district}, {selectedOrder.province}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <CreditCard size={16} color="#666" />
                                            <span style={{ fontSize: "0.9rem" }}>{paymentMethodMap[selectedOrder.paymentMethod]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div>
                                    <h4 style={{ fontSize: "0.9rem", color: "#999", textTransform: "uppercase", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Danh sách sản phẩm</h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                                <div style={{ width: "50px", height: "50px", position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid #eee" }}>
                                                    <Image src={item.imageUrl || "/placeholder.png"} alt={item.productName} fill style={{ objectFit: "cover" }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>{item.productName}</p>
                                                    <p style={{ fontSize: "0.8rem", color: "#666" }}>
                                                        {formatPrice(item.price)} x {item.quantity}
                                                    </p>
                                                </div>
                                                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontWeight: 600 }}>Tổng tiền:</span>
                                            <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-primary)" }}>{formatPrice(selectedOrder.totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
                                <div style={{ padding: "15px", background: "#f9fafb", borderRadius: "8px" }}>
                                    <label style={{ fontSize: "0.75rem", color: "#999", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "8px" }}>Ghi chú từ khách</label>
                                    <p style={{ fontStyle: "italic", color: "#444", fontSize: "0.9rem" }}>{selectedOrder.notes || "Không có ghi chú"}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "#999", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "10px" }}>Ghi chú nội bộ</label>
                                    <textarea
                                        className={styles.formTextarea}
                                        placeholder="Nhập ghi chú sau khi xử lý đơn..."
                                        rows={3}
                                        value={staffNote}
                                        onChange={(e) => setStaffNote(e.target.value)}
                                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
                                    />
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, selectedOrder.status)}
                                        style={{ marginTop: "10px" }}
                                        className={`${styles.btn} ${styles.btnSecondary}`}
                                        disabled={isUpdating}
                                    >
                                        Lưu ghi chú
                                    </button>
                                </div>
                            </div>

                            {/* Status Update Section */}
                            <div style={{ borderTop: "1px solid #eee", paddingTop: "25px" }}>
                                <label style={{ fontSize: "0.75rem", color: "#999", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "15px" }}>Cập nhật trạng thái</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, "CONFIRMED")}
                                        className={styles.btn}
                                        style={{ background: "#f59e0b", color: "#fff" }}
                                        disabled={isUpdating || selectedOrder.status === "CONFIRMED"}
                                    >
                                        Xác nhận chốt đơn
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, "SHIPPING")}
                                        className={styles.btn}
                                        style={{ background: "#8b5cf6", color: "#fff" }}
                                        disabled={isUpdating || selectedOrder.status === "SHIPPING"}
                                    >
                                        Đang giao hàng
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, "COMPLETED")}
                                        className={styles.btn}
                                        style={{ background: "#10b981", color: "#fff" }}
                                        disabled={isUpdating || selectedOrder.status === "COMPLETED"}
                                    >
                                        Hoàn thành
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, "CANCELLED")}
                                        className={styles.btn}
                                        style={{ background: "#ef4444", color: "#fff" }}
                                        disabled={isUpdating || selectedOrder.status === "CANCELLED"}
                                    >
                                        Hủy đơn hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
