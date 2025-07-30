import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { DeejahStrandsCollectionSection } from "@/components/home/DeejahStrandsCollectionSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ConsultationCtaSection } from "@/components/home/ConsultationCtaSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import DealsSection from "@/components/home/DealsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection
        data={{
          backgroundType: "video",
          backgroundUrl: "https://res.cloudinary.com/dhnanmyf3/video/upload/v1753709630/19v_fbxnd3.mp4",
          title: "LUXURY HAIR THAT SPEAKS FOR YOU",
          description: "Experience the finest raw and virgin hair — flawlessly customized for your look, lifestyle, and legacy.",
          shopNowLink: "/collections",
        }}
      />
      <FeaturesSection />
      <DeejahStrandsCollectionSection />
      <CategoriesSection />
      <TestimonialsSection />
      <DealsSection />
      <ConsultationCtaSection />
    </>
  );
}
