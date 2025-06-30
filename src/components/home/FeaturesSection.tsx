import { SectionContainer } from "@/components/common/section-container";
import { Button } from "@/components/common/button";
import Image from "next/image";
import { Settings2 } from "lucide-react";

export function FeaturesSection() {
  return (
    <div className="bg-secondary w-full mt-8">
    <SectionContainer className="bg-secondary rounded-2xl py-8 md:py-16 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center h-full">
        {/* Left: Image */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-8 h-full flex items-center">
          <Image
            src="https://res.cloudinary.com/dwpetnbf1/image/upload/v1750945478/20_vykyai.png"
            alt="Customize your own unit"
            width={800}
            height={660}
            className="rounded-xl object-cover w-full h-full max-h-[400px] md:max-h-[660px]"
            priority
          />
        </div>
        {/* Right: Content */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col items-start justify-center h-full">
          <h2 className="text-2xl md:text-3xl font-ethereal mb-4 text-gray-900">Customize Your Own Unit</h2>
          <p className="text-sm md:text-base text-gray-700 mb-6">
           Tailored to Your specifications: A custom-made wig uniquely crafted to reflect your personality, style, and preferences.
          </p>
          <p className="text-sm md:text-base text-gray-700 mb-6">Personally creating a unit that is uniquely yours from the color, cut, and styling</p>
          <Button variant="primary" icon={<Settings2 size={18} />}>
            Start Customizing
          </Button>
        </div>
      </div>
    </SectionContainer>
    </div>
  );
} 