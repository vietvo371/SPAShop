"use client";

export default function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <a
        href="https://zalo.me/0824368694"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-btn-zalo"
        aria-label="Chat Zalo"
        title="Chat Zalo"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.18 1.88 5.82L2.3 21.7l4.06-1.52C7.88 21.34 9.87 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.85 0-3.57-.55-5.01-1.49l-.35-.22-2.42.91.68-2.55-.23-.37A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      </a>
      <a
        href="tel:+84824368694"
        className="floating-btn floating-btn-phone"
        aria-label="Gọi điện"
        title="Gọi ngay"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    </div>
  );
}
