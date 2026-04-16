"use client";

import React, { useState, useEffect } from "react";

export default function FloatingPhone() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <a
            href="tel:+84356308211"
            style={{
                position: "fixed",
                right: "20px",
                bottom: "100px",
                zIndex: 1000,
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
                boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
                textDecoration: "none",
                animation: "pulse 2s ease infinite",
                overflow: "hidden"
            }}
            aria-label="WhatsApp"
        >
            <img
                src="/images/icon/whatsapp.png"
                alt="WhatsApp"
                width="60"
                height="60"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
        </a>
    );
}
