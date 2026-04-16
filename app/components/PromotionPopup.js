"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PromotionPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if popup has been shown in this session
        const hasSeenPopup = sessionStorage.getItem("hasSeenPromoPopup");

        if (!hasSeenPopup) {
            // Show popup after 2 seconds delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem("hasSeenPromoPopup", "true");
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={handleClose}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={handleClose} aria-label="Close popup">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="popup-info">
                    <div className="popup-image">
                        <Image
                            src="https://res.cloudinary.com/dltbjoii4/image/upload/q_auto/f_auto/v1776259605/ugl6vke7tgmc8cxitazx.png"
                            alt="Promotion"
                            fill
                            priority
                        />
                    </div>
                    <div className="popup-body">
                        <h2 className="popup-title">
                            Tâm an chăm sóc sức khỏe từ gốc rễ, mang lại sự an lành tự nhiên.
                        </h2>
                        <p className="popup-text">
                            Mang đến trải nghiệm chăm sóc sức khỏe tự nhiên, an toàn và tiện lợi ngay tại không gian sống của bạn.
                        </p>
                        <Link
                            href="/dich-vu-cham-soc"
                            className="popup-action-btn"
                            onClick={handleClose}
                        >
                            Xem Chi tiết
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
