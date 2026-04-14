import Image from "next/image";

export const metadata = {
  title: "Về Tâm An - Câu Chuyện Của Chúng Tôi",
  description: "Tìm hiểu về Tâm An Energy Healing - Trung tâm chăm sóc sức khỏe bằng công nghệ hồng ngoại xa tại Vũng Tàu.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Câu Chuyện Tâm An</h1>
          <p>Hành trình mang sức khỏe đến mọi gia đình Việt</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <h2>Sứ Mệnh Của Chúng Tôi</h2>
              <p>
                Tâm An Energy Healing được thành lập với sứ mệnh mang công nghệ chăm sóc sức khỏe tiên tiến đến gần hơn với mọi gia đình Việt Nam. Chúng tôi tin rằng sức khỏe là nền tảng của hạnh phúc, và mỗi người đều xứng đáng được tiếp cận với những phương pháp điều trị tốt nhất.
              </p>
              <p>
                Với đội ngũ chuyên gia giàu kinh nghiệm và trang thiết bị hiện đại, Tâm An cam kết cung cấp các dịch vụ chăm sóc sức khỏe chất lượng cao, từ liệu pháp hồng ngoại xa (FIR) đến các phương pháp chẩn đoán tiên tiến.
              </p>
              <p>
                Tại Tâm An, chúng tôi không chỉ điều trị triệu chứng mà còn hướng đến việc phục hồi sức khỏe toàn diện — <strong>&ldquo;Khỏe Từ Bên Trong&rdquo;</strong>. Đó là triết lý xuyên suốt trong mọi hoạt động của chúng tôi.
              </p>
            </div>
            <div className="page-image-wrapper">
              <Image
                src="https://res.cloudinary.com/dltbjoii4/image/upload/v1776184763/chanan/nesb9ha795fnlokag6i2.jpg"
                alt="Tâm An Center"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          <div className="values-section">
            <h2 className="section-title">Giá Trị Cốt Lõi</h2>
            <div className="values-grid">
              {[
                { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M17.8 7.96c-.18-.42-.2-.94.09-1.37a5.5 5.5 0 0 0-2.18-1.74c-.31.31-.77.56-1.3.56-.54 0-1-.25-1.31-.56A5.52 5.52 0 0 0 10.92 6.6c.29.43.28.95.09 1.37-.18.42-.53.74-1.01.93.09.69.39 1.31.82 1.82.25-.12.53-.18.82-.18.6 0 1.13.28 1.48.72.34-.44.87-.72 1.47-.72.29 0 .57.07.82.18.43-.51.73-1.13.82-1.82-.48-.19-.83-.51-1.01-.93zM12 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm5.92 8c-2.53 0-4.93.42-7.19 1.2C8.46 14 5.76 14.42 3.23 14.42c-.47 0-.93-.02-1.38-.06A14.24 14.24 0 0 0 1 19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2 0-1.7-.35-3.33-.99-4.8-.41.05-.81.08-1.22.08-.63 0-1.24-.06-1.84-.16-.3.07-.62.1-.95.1z"/></svg>, title: "Tự Nhiên", desc: "Sử dụng năng lượng hồng ngoại xa — phương pháp tự nhiên, an toàn, không tác dụng phụ." },
                { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm12.94-4H19V4.06c0-.56-.45-1.01-1.01-1.01h-.03C12.3 3.25 7.51 5.82 4.07 9.67c-.22.25-.04.63.28.63H7c1.1 0 2-.9 2-2h2c0 2.21-1.79 4-4 4v2c3.87 0 7-3.13 7-7h2c0 4.97-4.03 9-9 9v2c6.08 0 11-4.93 11-11h2v2.06c0 .56.45 1.01 1.01 1.01.28 0 .53-.11.71-.29.19-.19.29-.44.29-.72V7.06c-.01-.56-.46-1.01-1.01-1.06z"/></svg>, title: "Khoa Học", desc: "Ứng dụng công nghệ FIR được nghiên cứu và chứng minh hiệu quả bởi khoa học hiện đại." },
                { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-primary)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>, title: "Tận Tâm", desc: "Đội ngũ tư vấn chu đáo, luôn đặt sức khỏe khách hàng lên hàng đầu." },
              ].map((v, i) => (
                <div key={i} className="value-card">
                  <div className="value-icon">{v.icon}</div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="certificates-section">
        <div className="container">
          <div className="certificate-header">
            <h2 className="section-title">Giá Trị Được Công Nhận</h2>
            <p className="section-subtitle">Chứng nhận quốc tế và bằng sáng chế công nghệ Hồng ngoại xa (FIR)</p>
          </div>
          
          <div className="certificate-grid">
            {[
              "https://res.cloudinary.com/dltbjoii4/image/upload/v1776184765/chanan/tccywrv0gjhua1kklacx.jpg",
              "https://res.cloudinary.com/dltbjoii4/image/upload/v1776184766/chanan/ujwmakwudqkyqamp3opr.jpg",
              "https://res.cloudinary.com/dltbjoii4/image/upload/v1776184768/chanan/f3pkbzqsicv3utvp1zeg.jpg"
            ].map((url, index) => (
              <div key={index} className="certificate-card">
                <div className="certificate-image-wrapper">
                  <Image 
                    src={url} 
                    alt={`Chứng nhận ${index + 1}`} 
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
