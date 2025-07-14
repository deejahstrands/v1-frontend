"use client";
import { SectionContainer } from "@/components/common/section-container";
import Link from "next/link";
import { motion } from "framer-motion";

export function BannerSection() {
  return (
    <div className="pt-6 lg:pt-10">
    <SectionContainer>
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg min-h-[200px] md:min-h-[320px] flex items-end justify-center bg-black/70"
        style={{
          backgroundImage: "url('/images/banner.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="relative z-10 w-full p-8 md:p-16 flex flex-col items-center justify-end text-center bg-black/40"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-xl md:text-5xl font-ethereal font-semibold text-white mb-2 md:mb-4 drop-shadow-lg">
            SHOP ALL PRODUCTS
          </h1>
          <p className="text-xs md:text-lg text-white mb-4 max-w-2xl drop-shadow">
            Explore luxury wigs, bundles, and HD frontals crafted from raw donor hair.
          </p>
          <div className="text-xs text-white/80">
            <Link href="/" className="hover:underline">Home</Link>  <span className="mx-2"> / </span> <span className="text-white">Shop</span>
          </div>
        </motion.div>
      </motion.div>
    </SectionContainer>
    </div>
  );
} 