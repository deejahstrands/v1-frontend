"use client";

import { SectionContainer } from "@/components/common/section-container";
import { Button } from "@/components/common/button";
import { ShoppingBag, Calendar } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useCollections } from "@/store/use-collections";

export function HeroSection() {
    const {
        featuredCollection,
        featuredLoading,
        featuredError
    } = useCollections();

    // Determine background media and type
    const backgroundUrl = featuredCollection?.video || featuredCollection?.thumbnail;
    const backgroundType = featuredCollection?.video ? "video" : "image";
    const title = featuredCollection?.name || "Deejah Strands Collection";
    const description = featuredCollection?.description || "Discover our premium collection of wigs and hair extensions";
    const shopNowLink = "/collections";

    // Loading state - show when actively loading or when no data exists yet
    if (featuredLoading || (!featuredCollection && !featuredError)) {
        return (
            <SectionContainer className="pt-8 pb-12">
                <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[400px] h-[80vh] flex items-end justify-center bg-gray-200 animate-pulse">
                    <div className="relative z-10 w-full p-8 md:p-16 flex flex-col items-start justify-end">
                        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
                        <div className="flex gap-4">
                            <div className="h-10 bg-gray-300 rounded w-32"></div>
                            <div className="h-10 bg-gray-300 rounded w-40"></div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        );
    }

    // Error state - show fallback hero
    if (featuredError || !backgroundUrl) {
        return (
            <SectionContainer className="pt-8 pb-12">
                <motion.div 
                    className="relative rounded-2xl overflow-hidden shadow-lg min-h-[400px] h-[80vh] flex items-end justify-center bg-gradient-to-br from-purple-600 to-pink-600"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                        duration: 1, 
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                >
                    <div className="relative z-10 w-full p-8 md:p-16 flex flex-col items-start justify-end">
                        <motion.h1 
                            className="text-lg md:text-xl lg:text-2xl xl:text-5xl font-ethereal font-semibold text-white mb-2 md:mb-4 drop-shadow-lg"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 0.8, 
                                ease: [0.25, 0.46, 0.45, 0.94],
                                delay: 0.3
                            }}
                        >
                            {title}
                        </motion.h1>
                        <motion.p 
                            className="text-xs md:text-base text-white mb-6 md:mb-8 max-w-2xl drop-shadow"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 0.8, 
                                ease: [0.25, 0.46, 0.45, 0.94],
                                delay: 0.6
                            }}
                        >
                            {description}
                        </motion.p>
                        <motion.div 
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 0.8, 
                                ease: [0.25, 0.46, 0.45, 0.94],
                                delay: 0.9
                            }}
                        >
                            <Button
                                asChild
                                variant="primary"
                                icon={<ShoppingBag size={18} />}
                            >
                                <a href={shopNowLink}>Shop Now</a>
                            </Button>
                            <Button
                                asChild
                                variant="tertiary"
                                icon={<Calendar size={18} />}
                            >
                                <a href="/consultation">Book A Consultation</a>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </SectionContainer>
        );
    }

    return (
        <SectionContainer className="pt-8 pb-12">
            <motion.div 
                className="relative rounded-2xl overflow-hidden shadow-lg min-h-[400px] h-[80vh] flex items-end justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                    duration: 1, 
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
            >
                {/* Background Media */}
                {backgroundType === "video" ? (
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src={backgroundUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <Image
                        className="absolute inset-0 w-full h-full object-cover"
                        src={backgroundUrl || "/images/hero-fallback.jpg"}
                        width={1920}
                        height={1080}
                        alt="Hero background"
                    />
                )}
                {/* Overlay at the bottom */}
                <div className="relative z-10 w-full p-8 md:p-16 flex flex-col items-start justify-end bg-transparent">
                    <motion.h1 
                        className="text-lg md:text-xl lg:text-2xl xl:text-5xl font-ethereal font-semibold text-white mb-2 md:mb-4 drop-shadow-lg uppercase"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 0.8, 
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: 0.3
                        }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p 
                        className="text-xs md:text-base text-white mb-6 md:mb-8 max-w-2xl drop-shadow"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 0.8, 
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: 0.6
                        }}
                    >
                        {description}
                    </motion.p>
                                         <motion.div 
                         className="flex gap-4"
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ 
                             duration: 0.8, 
                             ease: [0.25, 0.46, 0.45, 0.94],
                             delay: 0.9
                         }}
                     >
                         <motion.div
                             initial={{ opacity: 0, x: -50, rotate: -5 }}
                             whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                             viewport={{ once: true }}
                             transition={{ 
                                 duration: 0.6, 
                                 ease: [0.34, 1.56, 0.64, 1],
                                 delay: 1.2
                             }}
                             whileHover={{ 
                                 scale: 1.08, 
                                 rotate: 2,
                                 transition: { duration: 0.3 }
                             }}
                             whileTap={{ scale: 0.92 }}
                         >
                             <Button
                                 asChild
                                 variant="primary"
                                 icon={<ShoppingBag size={18} />}
                             >
                                 <a href={shopNowLink}>Shop Now</a>
                             </Button>
                         </motion.div>
                         <motion.div
                             initial={{ opacity: 0, x: 50, rotate: 5 }}
                             whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                             viewport={{ once: true }}
                             transition={{ 
                                 duration: 0.6, 
                                 ease: [0.34, 1.56, 0.64, 1],
                                 delay: 1.5
                             }}
                             whileHover={{ 
                                 scale: 1.08, 
                                 rotate: -2,
                                 transition: { duration: 0.3 }
                             }}
                             whileTap={{ scale: 0.92 }}
                         >
                             <Button
                                 asChild
                                 variant="tertiary"
                                 icon={<Calendar size={18} />}
                             >
                                 <a href="/consultation">Book A Consultation</a>
                             </Button>
                         </motion.div>
                     </motion.div>
                </div>
            </motion.div>
        </SectionContainer>
    );
}
