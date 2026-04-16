"use client";

import React, { useState, useEffect } from "react";

export default function ZaloWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    window.open("https://zalo.me/0356308211", "_blank");
  };

  if (!mounted) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        right: "20px",
        bottom: "170px",
        zIndex: 900,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-primary)",
        boxShadow: "0 0 0 0 rgba(104, 10, 178, 0.4)",
        cursor: "pointer",
        transition: "transform 0.3s ease",
        animation: "ripple-primary 2s infinite ease-in-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      aria-label="Chat Zalo"
    >
      <img
        src="/images/icon/iconzalo.png"
        alt="Zalo"
        width="50"
        height="50"
        style={{
          width: "75%",
          height: "75%",
          objectFit: "contain"
        }}
      />
    </div>
  );
}