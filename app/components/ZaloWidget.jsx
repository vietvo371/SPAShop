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
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="30" cy="30" r="30" fill="#0068FF" />
        <path
          d="M30 15C22.5 15 16 20.5 16 27C16 30.5 18 33.5 20.5 35.5L19 42L27 38.5C29 39 31 39.5 33.5 39.5C40.5 39.5 46 34 46 27C46 20.5 40.5 15 33.5 15H30Z"
          fill="white"
        />
        <path
          d="M32 24C30 24 28 26 28 28.5C28 31 30 33 32 33C34 33 36 31 36 28.5C36 26 34 24 32 24Z"
          fill="#0068FF"
        />
        <path
          d="M35 26C35.5 26 36 25.5 36 25C36 24.5 35.5 24 35 24C34.5 24 34 24.5 34 25C34 25.5 34.5 26 35 26Z"
          fill="#0068FF"
        />
        <path
          d="M30 25C30.5 25 31 24.5 31 24C31 23.5 30.5 23 30 23C29.5 23 29 23.5 29 24C29 24.5 29.5 25 30 25Z"
          fill="#0068FF"
        />
        <path
          d="M25 26C25.5 26 26 25.5 26 25C26 24.5 25.5 24 25 24C24.5 24 24 24.5 24 25C24 25.5 24.5 26 25 26Z"
          fill="#0068FF"
        />
      </svg>
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