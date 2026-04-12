import Image from "next/image";

export const metadata = {
  title: "Kiến Thức Sức Khỏe - Tâm An Energy Healing",
  description: "Cập nhật kiến thức về công nghệ hồng ngoại xa (FIR), tips chăm sóc sức khỏe và bài viết hữu ích từ chuyên gia.",
};

const articles = [
  {
    id: 1,
    title: "Hồng ngoại xa (FIR) là gì? Tác dụng đối với sức khỏe",
    excerpt: "Tìm hiểu về công nghệ hồng ngoại xa và những lợi ích tuyệt vời mà FIR mang lại cho sức khỏe con người...",
    date: "25/03/2026",
    category: "Kiến thức FIR",
    image: "/images/hero-banner.png",
  },
  {
    id: 2,
    title: "5 cách chăm sóc sức khỏe tại nhà với hồng ngoại xa",
    excerpt: "Hướng dẫn chi tiết cách sử dụng các thiết bị FIR tại nhà để cải thiện sức khỏe toàn diện...",
    date: "22/03/2026",
    category: "Hướng dẫn",
    image: "/images/service-meridian.png",
  },
  {
    id: 3,
    title: "Điều trị Gout bằng hồng ngoại xa: Giải pháp từ thiên nhiên",
    excerpt: "Liệu pháp hồng ngoại xa đã được chứng minh hiệu quả trong việc hỗ trợ điều trị bệnh Gout...",
    date: "20/03/2026",
    category: "Sức khỏe",
    image: "/images/service-blood.png",
  },
  {
    id: 4,
    title: "Vai trò của vi tuần hoàn máu đối với sức khỏe",
    excerpt: "Vi tuần hoàn máu đóng vai trò quan trọng trong việc vận chuyển dưỡng chất đến các tế bào...",
    date: "18/03/2026",
    category: "Kiến thức FIR",
    image: "/images/service-blood.png",
  },
  {
    id: 5,
    title: "12 Đường Kinh Lạc và ý nghĩa trong y học cổ truyền",
    excerpt: "Hệ thống 12 đường kinh lạc là nền tảng của y học cổ truyền phương Đông, giúp chẩn đoán và điều trị bệnh...",
    date: "15/03/2026",
    category: "Y học cổ truyền",
    image: "/images/service-meridian.png",
  },
  {
    id: 6,
    title: "Trang sức hồng ngoại xa: Vừa đẹp vừa tốt cho sức khỏe",
    excerpt: "Khám phá bộ sưu tập trang sức FIR cao cấp — Sự kết hợp hoàn hảo giữa thời trang và sức khỏe...",
    date: "12/03/2026",
    category: "Sản phẩm",
    image: "/images/product-fir-jewelry.png",
  },
];

export default function KnowledgePage() {
  return (
    <div className="knowledge-page">
      <section className="page-hero blog-hero">
        <div className="container">
          <h1>Kiến Thức Sức Khỏe</h1>
          <p>Cập nhật những thông tin hữu ích về sức khỏe và công nghệ FIR</p>
        </div>
      </section>

      <section className="page-content blog-section">
        <div className="container">
          <div className="blog-grid">
            {articles.map((article) => (
              <article key={article.id} className="blog-card">
                <div className="blog-card-image">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }} 
                  />
                  <span className="blog-category-tag">
                    {article.category}
                  </span>
                </div>
                <div className="blog-card-content">
                  <p className="blog-date">
                    {article.date}
                  </p>
                  <h3 className="blog-title">
                    {article.title}
                  </h3>
                  <p className="blog-excerpt">
                    {article.excerpt}
                  </p>
                  <span className="blog-read-more">
                    Đọc thêm &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
