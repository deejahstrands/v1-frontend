import { SectionContainer } from "@/components/common/section-container";
import { Button } from "@/components/common/button";
import { ShoppingBag, Calendar } from "lucide-react";
import Image from "next/image";

interface HeroSectionData {
    backgroundType: "image" | "video";
    backgroundUrl: string;
    title: string;
    description: string;
    shopNowLink: string;
}

export function HeroSection({ data }: { data: HeroSectionData }) {
    return (
        <SectionContainer className="pt-8 pb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[400px] h-[80vh] flex items-end justify-center">
                {/* Background Media */}
                {data.backgroundType === "video" ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src={data.backgroundUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <Image
                        className="absolute inset-0 w-full h-full object-cover"
                        src={data.backgroundUrl}
                        width={1920}
                        height={1080}
                        alt="Hero background"
                    />
                )}
                {/* Overlay at the bottom */}
                <div className="relative z-10 w-full p-8 md:p-16 flex flex-col items-start justify-end bg-transparent">
                    <h1 className="text-lg md:text-xl lg:text-2xl xl:text-5xl font-ethereal font-semibold text-white mb-2 md:mb-4 drop-shadow-lg">
                        {data.title}
                    </h1>
                    <p className="text-xs md:text-base text-white mb-6 md:mb-8 max-w-2xl drop-shadow">
                        {data.description}
                    </p>
                    <div className="flex gap-4">
                        <Button
                            asChild
                            variant="primary"
                            icon={<ShoppingBag size={18} />}
                        >
                            <a href={data.shopNowLink}>Shop Now</a>
                        </Button>
                        <Button
                            asChild
                            variant="tertiary"
                            icon={<Calendar size={18} />}
                        >
                            <a href="/consultation">Book A Consultation</a>
                        </Button>
                    </div>
                </div>
            </div>

        </SectionContainer>
    );
}
