const testimonials = [
  {
    id: 1,
    name: "Chị Nguyễn Thu Hà",
    role: "Khách hàng tại Vũng Tàu",
    text: "Sau 2 tuần sử dụng đèn hồng ngoại xa, triệu chứng gout của tôi giảm rõ rệt. Cảm ơn Tâm An rất nhiều!",
    initials: "NH",
  },
  {
    id: 2,
    name: "Anh Trần Minh Đức",
    role: "Khách hàng tại TP.HCM",
    text: "Dịch vụ soi mạch máu giúp tôi phát hiện sớm vấn đề về tuần hoàn. Đội ngũ rất chuyên nghiệp và tận tâm.",
    initials: "MD",
  },
  {
    id: 3,
    name: "Cô Lê Thị Mai",
    role: "Khách hàng tại Đồng Nai",
    text: "Thảm đá ngọc hồng ngoại xa thật sự tuyệt vời! Giấc ngủ của tôi cải thiện rất nhiều sau khi sử dụng.",
    initials: "TM",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <h2 className="section-title">Khách Hàng Nói Gì</h2>
        <p className="section-subtitle">
          Hàng nghìn khách hàng đã tin tưởng và trải nghiệm dịch vụ tại Tâm An
        </p>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-stars">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
              <div className="testimonial-quote">&ldquo;</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
