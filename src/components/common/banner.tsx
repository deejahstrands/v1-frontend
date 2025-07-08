"use client";
import { SectionContainer } from "@/components/common/section-container";
import { motion } from "framer-motion";
import React from "react";

export function Banner({
  title,
  description,
  breadcrumb,
  bgImage = "/images/banner.svg",
}: {
  title: string;
  description: string;
  breadcrumb?: React.ReactNode;
  bgImage?: string;
}) {
  return (
    <div className="pt-6 lg:pt-10">
      <SectionContainer>
        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-lg min-h-[200px] md:min-h-[320px] flex items-end justify-center bg-black/70"
          style={{
            backgroundImage: `url('${bgImage}')`,
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
              {title}
            </h1>
            <p className="text-xs md:text-lg text-white mb-4 max-w-2xl drop-shadow">
              {description}
            </p>
            {breadcrumb && (
              <div className="text-xs text-white/80">{breadcrumb}</div>
            )}
          </motion.div>
        </motion.div>
      </SectionContainer>
    </div>
  );
} 