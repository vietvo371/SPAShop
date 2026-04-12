import BookingForm from "@/app/components/BookingForm";
import Image from "next/image";

export const metadata = {
  title: "Đặt Lịch Hẹn - Tâm An Energy Healing",
  description: "Đặt lịch hẹn dịch vụ chăm sóc sức khỏe tại Tâm An Energy Healing. Điều trị Gout, Soi mạch máu, Đo 12 đường kinh lạc bằng công nghệ FIR.",
};

export default function DatLichHenPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Đặt Lịch Hẹn</h1>
          <p>Đặt lịch hẹn dịch vụ chăm sóc sức khỏe tại Tâm An</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="booking-page-grid">
            {/* Left: Info */}
            <div className="booking-info">
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "20px" }}>
                Thông Tin Liên Hệ
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                {[
                  { icon: "📍", label: "Địa chỉ", value: "02 Phan Long Bằng, Quảng Ngãi" },
                  { icon: "📞", label: "Hotline", value: "035 630 8211" },
                  { icon: "🕐", label: "Giờ làm việc", value: "Thứ 2 - Chủ nhật: 8:00 - 20:00" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: "16px",
                    padding: "16px",
                    background: "var(--color-cream)",
                    borderRadius: "var(--radius-sm)",
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "var(--color-dark)" }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <iframe
                  src="https://www.google.com/maps?q=02+Phan+Long+Băng,+Quảng+Ngãi&output=embed"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Tâm An Location"
                />
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="booking-form-wrapper">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
