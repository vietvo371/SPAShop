import HeroBanner from "../components/HeroBanner";
import PromoBanner from "../components/PromoBanner";
import ProductSlider from "../components/ProductSlider";
import ServiceGrid from "../components/ServiceGrid";
import Testimonials from "../components/Testimonials";
import VideoGuides from "../components/VideoGuides";
import WhyChooseUs from "../components/WhyChooseUs";
import BannerCTA from "../components/BannerCTA";
import FAQ from "../components/FAQ";
import PromotionPopup from "../components/PromotionPopup";

// Title/description dùng mặc định từ layout gốc; chỉ cần khai canonical riêng.
export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <PromotionPopup />
      <HeroBanner />
      <PromoBanner />
      <ProductSlider />
      <ServiceGrid />
      <WhyChooseUs />
      <Testimonials />
      <BannerCTA />
      <FAQ />
      <VideoGuides />
    </>
  );
}
