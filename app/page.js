import HeroBanner from "./components/HeroBanner";
import PromoBanner from "./components/PromoBanner";
import ProductSlider from "./components/ProductSlider";
import ServiceGrid from "./components/ServiceGrid";
import Testimonials from "./components/Testimonials";
import VideoGuides from "./components/VideoGuides";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PromoBanner />
      <ProductSlider />
      <ServiceGrid />
      <Testimonials />
      <VideoGuides />
    </>
  );
}
