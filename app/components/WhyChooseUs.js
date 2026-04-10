"use client";
import Link from "next/link";

export default function WhyChooseUs() {
  const reasons = [
    { title: "An toàn - Minh bạch", icon: "🛡️" },
    { title: "Thiết bị chính hãng", icon: "⚙️" },
    { title: "Bảo mật riêng tư", icon: "🔒" },
    { title: "Hài lòng dịch vụ", icon: "⭐" },
  ];

  return (
    <section className="why-choose-us" id="about-us">
      <div className="container">
        <div className="why-choose-grid">
          <div className="why-choose-image">
            <div className="image-circle">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" 
                alt="Tại sao chọn Tâm An" 
              />
            </div>
          </div>
          <div className="why-choose-content">
            <h2 className="section-title left">Vì sao chọn Tâm An?</h2>
            <p className="why-choose-desc">
              Bằng việc kết hợp Công nghệ Hồng Ngoại Xa (FIR), thiết bị chính hãng và tinh hoa Y học cổ truyền (YHCT), Tâm An mang đến các liệu pháp an toàn - không xâm lấn - dễ chịu, phù hợp với nhịp sống hiện đại và hướng tới sức khỏe bền vững.
            </p>
            <div className="reasons-list">
              {reasons.map((reason, index) => (
                <div key={index} className="reason-item">
                  <span className="reason-icon">{reason.icon}</span>
                  <span className="reason-text">{reason.title}</span>
                </div>
              ))}
            </div>
            <Link href="/cau-chuyen-chan-an" className="btn-view-more">
              XEM CHI TIẾT
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
