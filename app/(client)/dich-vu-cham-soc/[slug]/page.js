import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import services from "@/data/services.json";

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  
  if (!service) {
    return { title: "Dịch vụ không tìm thấy" };
  }

  return {
    title: `${service.name} - Tâm An Energy Healing`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Related services (other than current)
  const relatedServices = services
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <div className="service-detail-page">
      {/* Breadcrumb */}
      <section style={{ padding: "160px 0 30px", background: "var(--color-beige-light)" }}>
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ul className="breadcrumb-list">
              <li className="breadcrumb-item">
                <Link href="/">Trang chủ</Link>
              </li>
              <li className="breadcrumb-separator">·</li>
              <li className="breadcrumb-item">
                <Link href="/dich-vu-cham-soc">Dịch vụ chăm sóc</Link>
              </li>
              <li className="breadcrumb-separator">·</li>
              <li className="breadcrumb-item active">
                <span>{service.name}</span>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Service Hero */}
      <section style={{ padding: "40px 0 80px", background: "white" }}>
        <div className="container">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "60px", 
            alignItems: "center" 
          }}>
            {/* Image */}
            <div style={{ 
              position: "relative", 
              height: "450px", 
              borderRadius: "var(--radius-lg)", 
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)"
            }}>
              <Image
                src={service.image}
                alt={service.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Content */}
            <div>
              <h1 style={{ 
                fontSize: "2.5rem", 
                fontWeight: 800, 
                fontFamily: "var(--font-heading)",
                color: "var(--color-primary)", 
                marginBottom: "20px",
                lineHeight: 1.2
              }}>
                {service.name}
              </h1>
              
              <p style={{ 
                fontSize: "1.1rem", 
                color: "var(--color-text-muted)", 
                lineHeight: 1.8, 
                marginBottom: "30px" 
              }}>
                {service.description}
              </p>

              {/* Features */}
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ 
                  fontSize: "1rem", 
                  fontWeight: 700, 
                  textTransform: "uppercase", 
                  letterSpacing: "1px", 
                  color: "var(--color-primary)",
                  marginBottom: "16px" 
                }}>
                  Lợi ích nổi bật
                </h3>
                <ul style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "12px",
                  listStyle: "none",
                  padding: 0
                }}>
                  {service.features.map((feature, i) => (
                    <li key={i} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "10px",
                      fontSize: "0.95rem",
                      color: "var(--color-dark)"
                    }}>
                      <span style={{ 
                        width: "24px", 
                        height: "24px", 
                        borderRadius: "50%", 
                        background: "var(--color-primary)", 
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        flexShrink: 0
                      }}>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <a href="tel:+84356308211" style={{ 
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 40px",
                background: "var(--color-primary)",
                color: "white",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                textDecoration: "none",
                transition: "var(--transition)",
                boxShadow: "0 4px 20px rgba(104, 10, 178, 0.3)"
              }}>
                <span>📞</span>
                Đặt Lịch Ngay
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      {service.process && (
        <section style={{ 
          padding: "80px 0", 
          background: "var(--color-cream)" 
        }}>
          <div className="container">
            <h2 style={{ 
              fontSize: "2rem", 
              fontWeight: 800, 
              fontFamily: "var(--font-heading)",
              color: "var(--color-primary)", 
              textAlign: "center",
              marginBottom: "50px"
            }}>
              Quy Trình Thực Hiện
            </h2>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(4, 1fr)", 
              gap: "30px" 
            }}>
              {service.process.map((step, i) => (
                <div key={i} style={{
                  background: "white",
                  padding: "30px 24px",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  boxShadow: "var(--shadow-sm)",
                  transition: "var(--transition)"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    margin: "0 auto 16px"
                  }}>
                    {i + 1}
                  </div>
                  <h3 style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--color-dark)",
                    marginBottom: "8px"
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: "0.9rem",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.6
                  }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      <section style={{ padding: "80px 0", background: "white" }}>
        <div className="container">
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: 800, 
            fontFamily: "var(--font-heading)",
            color: "var(--color-primary)", 
            textAlign: "center",
            marginBottom: "50px"
          }}>
            Dịch Vụ Liên Quan
          </h2>

          <div className="service-grid">
            {relatedServices.map((s) => (
              <div key={s.slug} className="service-card">
                <div className="service-card-image">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="service-card-content">
                  <h3 className="service-card-title">{s.name}</h3>
                  <p className="service-card-desc">{s.description}</p>
                  <div className="service-card-footer">
                    <Link href={`/dich-vu-cham-soc/${s.slug}`} className="btn-book-service">
                      Xem chi tiết &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 968px) {
          .service-detail-page > section:nth-child(2) > div > div {
            grid-template-columns: 1fr !important;
          }
        }
        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        @media (max-width: 992px) {
          .service-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .service-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}