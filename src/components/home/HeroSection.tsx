"use client";

import { SectionContainer } from "@/components/common/section-container";
import { Button } from "@/components/common/button";
import { ShoppingBag, Calendar } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

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
                        {data.title}
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
                        {data.description}
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
                                 <a href={data.shopNowLink}>Shop Now</a>
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
