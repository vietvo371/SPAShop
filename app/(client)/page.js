import HeroBanner from "../components/HeroBanner";
import PromoBanner from "../components/PromoBanner";
import ProductSlider from "../components/ProductSlider";
import ServiceGrid from "../components/ServiceGrid";
import Testimonials from "../components/Testimonials";
import VideoGuides from "../components/VideoGuides";
import WhyChooseUs from "../components/WhyChooseUs";
import BannerCTA from "../components/BannerCTA";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PromoBanner />
      <WhyChooseUs />
      <ProductSlider />
      <ServiceGrid />
      <Testimonials />
      <BannerCTA />
      <FAQ />
      <VideoGuides />
    </>
  );
}
