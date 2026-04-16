"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Phone, ShoppingBag } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");
    const [orderNum, setOrderNum] = useState("");

    useEffect(() => {
        setOrderNum(orderId ? orderId.substring(orderId.length - 8).toUpperCase() : "---");
    }, [orderId]);

    return (
        <main style={{ maxWidth: "600px", margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
            <CheckCircle size={80} color="#10a30b" style={{ marginBottom: "24px" }} />

            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>Đặt hàng thành công!</h1>
            <p style={{ color: "#666", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "32px" }}>
                Cảm ơn bạn đã tin tưởng Tâm An. Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý.
            </p>

            <div style={{ background: "#f9f9f9", borderRadius: "20px", padding: "30px", marginBottom: "40px", border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.9rem", color: "#888" }}>
                    <span>Mã đơn hàng:</span>
                    <span style={{ fontWeight: 700, color: "#1a1a1a" }}>#{orderNum}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#888" }}>
                    <span>Trạng thái:</span>
                    <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>Chờ xác nhận</span>
                </div>
            </div>

            <div style={{ textAlign: "left", marginBottom: "40px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>Tiếp theo là gì?</h3>
                <ul style={{ color: "#666", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <li>Nhân viên Tâm An sẽ gọi điện xác nhận đơn hàng trong vòng 15-30 phút.</li>
                    <li>Sản phẩm sẽ được đóng gói cẩn thận và giao tận tay bạn.</li>
                    <li>Bạn có thể kiểm tra sản phẩm trước khi thanh toán (với đơn COD).</li>
                </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href="/san-pham" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "var(--color-primary)", color: "white", textDecoration: "none", borderRadius: "50px", fontWeight: 700 }}>
                    <ShoppingBag size={18} /> TIẾP TỤC MUA SẮM
                </Link>
                <a href="tel:0356308211" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "#f0f0f0", color: "#333", textDecoration: "none", borderRadius: "50px", fontWeight: 700 }}>
                    <Phone size={18} /> HỖ TRỢ: 035 630 8211
                </a>
            </div>
        </main>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Suspense fallback={<div style={{ padding: "100px 0", textAlign: "center" }}>Đang tải thông tin đơn hàng...</div>}>
                <OrderSuccessContent />
            </Suspense>
            <Footer />
        </div>
    );
}
