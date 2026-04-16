"use client";

export default function ZaloWidget() {
  const handleClick = () => {
    window.open("https://zalo.me/0356308211", "_blank");
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        right: "20px",
        bottom: "100px",
        zIndex: 900,
        cursor: "pointer",
        transition: "transform 0.3s ease",
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
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 104, 255, 0);
          }
        }
      `}</style>
    </div>
  );
}