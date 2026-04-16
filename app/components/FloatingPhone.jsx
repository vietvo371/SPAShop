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
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--color-primary)",
                boxShadow: "0 0 0 0 rgba(104, 10, 178, 0.4)",
                textDecoration: "none",
                animation: "ripple-primary 2s infinite ease-in-out",
                overflow: "hidden"
            }}
            aria-label="WhatsApp"
        >
            <img
                src="/images/icon/whatsapp.png"
                alt="WhatsApp"
                width="50"
                height="50"
                style={{ width: "70%", height: "70%", objectFit: "contain" }}
            />
        </a>
    );
}
