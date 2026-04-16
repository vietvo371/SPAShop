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
        cursor: "pointer",
        transition: "transform 0.3s ease",
        animation: "pulse 2s ease infinite",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      aria-label="Chat Zalo"
    >
      <img
        src="/images/icon/iconzalo.png"
        alt="Zalo"
        width="60"
        height="60"
        style={{
          borderRadius: "50%",
          boxShadow: "0 4px 15px rgba(0, 104, 255, 0.3)",
          backgroundColor: "white"
        }}
      />
    </div>
  );
}