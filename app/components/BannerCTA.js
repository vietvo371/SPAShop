"use client";

export default function BannerCTA() {
  return (
    <section className="banner-cta">
      <div className="banner-overlay"></div>
      <div className="container banner-container">
        <div className="banner-content">
          <h2 className="banner-title">Phục Hồi Sức Khỏe Thuận Tự Nhiên</h2>
          <p className="banner-desc">
            Bằng việc kết hợp Công nghệ Hồng Ngoại Xa (FIR), thiết bị chính hãng và tinh hoa Y học cổ truyền (YHCT), Tâm An mang đến các liệu pháp an toàn – không xâm lấn – dễ chịu, phù hợp với nhịp sống hiện đại và hướng tới sức khỏe bền vững.
          </p>
          <div className="banner-actions">
            <a href="/lien-he" className="cta-btn primary">LIÊN HỆ TÂM AN</a>
            <a href="tel:+84824368694" className="cta-btn outline">
              GOI NGAY: +84 824368694
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
