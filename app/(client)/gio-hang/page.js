"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Truck, CreditCard, ShieldCheck, ShoppingBag, Trash2, MapPin, User, Phone, Mail, FileText } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { toast } from "sonner";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./checkout.module.css";
import { formatPrice } from "@/app/lib/utils";

function CheckoutContent() {
    const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart, isInitialized, buyNowItem, clearBuyNow } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isBuyNow = searchParams.get("mode") === "buy-now";

    // Use either the full cart or just the buy-now item
    const displayItems = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems;

    // Recalculate totals if in buy-now mode
    const displayTotal = isBuyNow
        ? (buyNowItem ? Number(buyNowItem.price || 0) * buyNowItem.quantity : 0)
        : cartTotal;

    const displayCount = isBuyNow
        ? (buyNowItem ? buyNowItem.quantity : 0)
        : cartCount;

    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerAddress: "",
        province: "",
        provinceCode: "",
        district: "",
        districtCode: "",
        ward: "",
        wardCode: "",
        notes: "",
        paymentMethod: "COD"
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Provinces
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error("Error fetching provinces", err));
    }, []);

    // Fetch Districts when Province changes
    useEffect(() => {
        if (formData.provinceCode) {
            fetch(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setDistricts(data.districts);
                    setWards([]);
                });
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [formData.provinceCode]);

    // Fetch Wards when District changes
    useEffect(() => {
        if (formData.districtCode) {
            fetch(`https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards));
        } else {
            setWards([]);
        }
    }, [formData.districtCode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e, type) => {
        const code = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;

        if (type === "province") {
            setFormData(prev => ({
                ...prev,
                province: name,
                provinceCode: code,
                district: "",
                districtCode: "",
                ward: "",
                wardCode: ""
            }));
        } else if (type === "district") {
            setFormData(prev => ({
                ...prev,
                district: name,
                districtCode: code,
                ward: "",
                wardCode: ""
            }));
        } else if (type === "ward") {
            setFormData(prev => ({
                ...prev,
                ward: name,
                wardCode: code
            }));
        }
    };

    const validateForm = () => {
        const requiredFields = [
            { key: "customerName", label: "Họ và tên" },
            { key: "customerPhone", label: "Số điện thoại" },
            { key: "customerAddress", label: "Địa chỉ chi tiết" },
            { key: "province", label: "Tỉnh / Thành phố" },
            { key: "district", label: "Quận / Huyện" },
            { key: "ward", label: "Phường / Xã" },
        ];

        for (const field of requiredFields) {
            if (!formData[field.key]) {
                toast.error(`Vui lòng nhập ${field.label}`);
                return false;
            }
        }

        if (formData.customerPhone && formData.customerPhone.length < 10) {
            toast.error("Số điện thoại không hợp lệ (tối thiểu 10 số)");
            return false;
        }

        return true;
    };

    const handleSubmitOrder = async (e) => {
        if (e) e.preventDefault();

        if (displayItems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống");
            return;
        }

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    items: displayItems.map(item => ({
                        productId: item.id,
                        productName: item.name,
                        price: Number(item.price || 0),
                        quantity: item.quantity,
                        imageUrl: item.imageUrl
                    })),
                    totalAmount: displayTotal
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Đặt hàng thành công! Cảm ơn bạn đã tin dùng sản phẩm của Tâm An.");
                if (isBuyNow) {
                    clearBuyNow();
                } else {
                    clearCart();
                }
                router.push("/dat-hang-thanh-cong?id=" + result.orderId);
            } else {
                // If there are specific validation details, show the first one
                if (result.details && result.details.length > 0) {
                    throw new Error(result.details[0].message);
                }
                throw new Error(result.error || "Gửi đơn hàng thất bại");
            }
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra khi tạo đơn hàng");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isInitialized) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className={styles.mainContainer}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <Link href="/">Trang chủ</Link>
                    <ChevronRight size={14} />
                    <span>Giỏ hàng & Thanh toán</span>
                </div>

                <h1 className={styles.pageTitle}>Thanh toán đơn hàng</h1>

                <div className={styles.checkoutGrid}>
                    {/* Left Side: Form */}
                    <form className={styles.formSection} onSubmit={handleSubmitOrder}>
                        {/* Payment Methods */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <CreditCard className={styles.titleIcon} size={20} />
                                PHƯƠNG THỨC THANH TOÁN
                            </h2>
                            <div className={styles.paymentOptions}>
                                <label className={`${styles.paymentLabel} ${formData.paymentMethod === "COD" ? styles.active : ""}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === "COD"}
                                        onChange={handleInputChange}
                                    />
                                    <div className={styles.paymentInfo}>
                                        <span className={styles.paymentName}>Thanh toán khi nhận hàng (COD)</span>
                                        <span className={styles.paymentDesc}>Bạn chỉ thanh toán khi đã nhận được sản phẩm</span>
                                    </div>
                                </label>
                                <label className={`${styles.paymentLabel} ${formData.paymentMethod === "TRANSFER" ? styles.active : ""}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="TRANSFER"
                                        checked={formData.paymentMethod === "TRANSFER"}
                                        onChange={handleInputChange}
                                    />
                                    <div className={styles.paymentInfo}>
                                        <span className={styles.paymentName}>Chuyển khoản ngân hàng</span>
                                        <span className={styles.paymentDesc}>Nhân viên sẽ liên hệ gửi số tài khoản khi chốt đơn</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>
                                <Truck className={styles.titleIcon} size={20} />
                                THÔNG TIN GIAO HÀNG
                            </h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label><User size={16} /> Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        required
                                        placeholder="Nhập họ và tên"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label><Phone size={16} /> Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        name="customerPhone"
                                        required
                                        placeholder="Nhập số điện thoại"
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label><Mail size={16} /> Email (không bắt buộc)</label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        placeholder="Nhập địa chỉ email"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label><MapPin size={16} /> Tỉnh / Thành phố *</label>
                                    <select
                                        required
                                        onChange={(e) => handleLocationChange(e, "province")}
                                        value={formData.provinceCode}
                                    >
                                        <option value="">Chọn Tỉnh / Thành phố</option>
                                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label><MapPin size={16} /> Quận / Huyện *</label>
                                    <select
                                        required
                                        onChange={(e) => handleLocationChange(e, "district")}
                                        disabled={!formData.provinceCode}
                                        value={formData.districtCode}
                                    >
                                        <option value="">Chọn Quận / Huyện</option>
                                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label><MapPin size={16} /> Phường / Xã *</label>
                                    <select
                                        required
                                        onChange={(e) => handleLocationChange(e, "ward")}
                                        disabled={!formData.districtCode}
                                        value={formData.wardCode}
                                    >
                                        <option value="">Chọn Phường / Xã</option>
                                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                    </select>
                                </div>

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label><MapPin size={16} /> Địa chỉ chi tiết *</label>
                                    <input
                                        type="text"
                                        name="customerAddress"
                                        required
                                        placeholder="Số nhà, tên đường..."
                                        value={formData.customerAddress}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label><FileText size={16} /> Ghi chú yêu cầu (không bắt buộc)</label>
                                    <textarea
                                        name="notes"
                                        rows="3"
                                        placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.mobileActions}>
                            <button type="submit" className={styles.submitBtn} disabled={isSubmitting || displayItems.length === 0}>
                                {isSubmitting ? "ĐANG XỬ LÝ..." : "HOÀN TẤT ĐẶT HÀNG"}
                            </button>
                        </div>
                    </form>

                    {/* Right Side: Cart Summary */}
                    <aside className={styles.summarySection}>
                        <div className={styles.summaryCard}>
                            <h2 className={styles.summaryTitle}>
                                <ShoppingBag className={styles.titleIcon} size={20} />
                                ĐƠN HÀNG ({displayCount})
                            </h2>

                            <div className={styles.itemsList}>
                                {displayItems.map((item) => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <div className={styles.itemImage}>
                                            <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: "cover" }} />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <h3 className={styles.itemName}>{item.name}</h3>
                                            <div className={styles.itemMeta}>
                                                <div className={styles.quantity}>
                                                    <span>Số lượng:</span>
                                                    <div className={styles.qtyBtns}>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                    </div>
                                                </div>
                                                <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                                            </div>
                                            <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                                <Trash2 size={14} /> Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {displayItems.length === 0 && (
                                <div className={styles.emptyState}>
                                    <ShoppingBag size={48} opacity={0.2} />
                                    <p>Giỏ hàng đang trống</p>
                                    <Link href="/san-pham" className={styles.shopLink}>Tiếp tục mua sắm</Link>
                                </div>
                            )}

                            <div className={styles.coupons}>
                                <input type="text" placeholder="Nhập mã voucher (nếu có)" />
                                <button type="button">Áp dụng</button>
                            </div>

                            <div className={styles.totals}>
                                <div className={styles.totalRow}>
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(displayTotal)}</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Phí vận chuyển</span>
                                    <span>Miễn phí</span>
                                </div>
                                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                    <span>TỔNG CỘNG</span>
                                    <span>{formatPrice(displayTotal)}</span>
                                </div>
                            </div>

                            <div className={styles.trustSignals}>
                                <div className={styles.signal}>
                                    <ShieldCheck size={16} />
                                    <span>Bảo mật 100%</span>
                                </div>
                                <div className={styles.signal}>
                                    <Truck size={16} />
                                    <span>Giao hàng nhanh</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmitOrder}
                                className={styles.submitBtnDesktop}
                                disabled={isSubmitting || displayItems.length === 0}
                            >
                                {isSubmitting ? "ĐANG XỬ LÝ..." : "HOÀT TẤT ĐẶT HÀNG"}
                            </button>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Đang tải thông tin thanh toán...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
