const videos = [
  {
    id: 1,
    title: "Hướng dẫn sử dụng Đèn Hồng Ngoại Xa FIR",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Kiến thức về công nghệ Hồng ngoại xa",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: 3,
    title: "Cách chăm sóc sức khỏe tại nhà với FIR",
    videoId: "dQw4w9WgXcQ",
  },
];

export default function VideoGuides() {
  return (
    <section className="video-section" id="videos">
      <div className="container">
        <h2 className="section-title">Video Hướng Dẫn</h2>
        <p className="section-subtitle">
          Xem hướng dẫn sử dụng sản phẩm và kiến thức sức khỏe từ chuyên gia
        </p>
        <div className="video-grid">
          {videos.map((v) => (
            <div key={v.id} className="video-card">
              <div className="video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${v.videoId}`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="video-info">
                <h3 className="video-title">{v.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
