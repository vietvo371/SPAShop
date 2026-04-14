"use client";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="55" stroke="#4A7C59" strokeWidth="4" strokeDasharray="8 4" />
            <path d="M60 35 L60 65 L80 80" stroke="#4A7C59" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="60" cy="60" r="4" fill="#4A7C59" />
          </svg>
        </div>

        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Oops! Trang không tồn tại</h2>
        <p className="not-found-desc">
          Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc thông tin đã thay đổi.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="btn-primary">
            Quay về trang chủ
          </Link>
          <Link href="/lien-he" className="btn-secondary">
            Liên hệ hỗ trợ
          </Link>
        </div>

        <div className="not-found-suggestion">
          <p>Bạn có thể tìm thấy thông tin mình cần tại:</p>
          <div className="suggestion-links">
            <Link href="/san-pham">Sản phẩm công nghệ</Link>
            <Link href="/dich-vu-cham-soc">Dịch vụ chăm sóc</Link>
            <Link href="/kien-thuc">Kiến thức sức khỏe</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .not-found-container {
          text-align: center;
          max-width: 600px;
          padding: 3rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .not-found-icon {
          margin-bottom: 1.5rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .not-found-code {
          font-size: 5rem;
          font-weight: 800;
          color: #4A7C59;
          margin: 0;
          line-height: 1;
        }

        .not-found-title {
          font-size: 1.5rem;
          color: #333;
          margin: 0.5rem 0 1rem;
        }

        .not-found-desc {
          color: #666;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 0.875rem 2rem;
          background: #4A7C59;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.3s;
        }

        .btn-primary:hover {
          background: #3d6a4a;
        }

        .btn-secondary {
          padding: 0.875rem 2rem;
          background: white;
          color: #4A7C59;
          border: 2px solid #4A7C59;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: #4A7C59;
          color: white;
        }

        .not-found-suggestion {
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }

        .not-found-suggestion p {
          color: #888;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .suggestion-links {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .suggestion-links a {
          color: #4A7C59;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .suggestion-links a:hover {
          color: #3d6a4a;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .not-found-code {
            font-size: 3.5rem;
          }

          .not-found-container {
            padding: 2rem 1.5rem;
          }

          .not-found-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}