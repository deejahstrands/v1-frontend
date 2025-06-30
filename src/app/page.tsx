import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { DeejahStrandsCollectionSection } from "@/components/home/DeejahStrandsCollectionSection";

export default function HomePage() {
  return (
    <>
      <HeroSection
        data={{
          backgroundType: "video",
          backgroundUrl: "https://res.cloudinary.com/dwpetnbf1/video/upload/v1750945562/19v_w20zdi.mp4",
          title: "LUXURY HAIR THAT SPEAKS FOR YOU",
          description: "Experience the finest raw and virgin hair — flawlessly customized for your look, lifestyle, and legacy.",
          shopNowLink: "/shop",
        }}
      />
      <FeaturesSection />
      <DeejahStrandsCollectionSection />
      
    </>
  );
}
