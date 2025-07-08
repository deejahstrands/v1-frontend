"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/common/section-container";

const END_DATE = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now

function getTimeLeft(end: Date) {
  const now = new Date();
  const diff = Math.max(0, end.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export default function DealsSection() {
  const [time, setTime] = useState(getTimeLeft(END_DATE));
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => {
      setTime(getTimeLeft(END_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timerBoxes = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.mins },
    { label: "Sec", value: time.secs },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
      className="w-full px-2 sm:px-4 md:px-8 lg:px-0 max-w-7xl mx-auto my-12"
    >
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl overflow-hidden">
          {/* Text Side */}
          <div className="lg:col-span-5 flex flex-col justify-center px-6 py-10 lg:py-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 font-ethereal">Deals Of The Month</h2>
            <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-md">
              This month, enjoy : Up to 70% Off on Super Sale items from Deejah Strands, including discounts on lace frontal wigs, V-part wigs, and more
            </p>
            <div className="flex gap-3 mb-6">
              {hasMounted && timerBoxes.map((box, i) => (
                <motion.div
                  key={box.label}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                  className="flex flex-col items-center"
                >
                  <div className="border-2 border-primary rounded-lg px-3 py-2 min-w-[56px] flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums">
                      {String(box.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#1A1A1A] font-medium mt-2">{box.label}</span>
                </motion.div>
              ))}
            </div>
            <button
              className="bg-primary text-white font-semibold rounded-lg px-6 py-3 text-base hover:bg-primary/90 transition-colors w-fit cursor-pointer"
              onClick={() => router.push("/deals")}
            >
              Buy Now
            </button>
          </div>
          {/* Image Side */}
          <div className="lg:col-span-7 w-full h-[320px] sm:h-[400px] md:h-[440px] lg:h-[500px] flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/dwpetnbf1/image/upload/v1750944596/16_witwsk.jpg"
              alt="Deals Of The Month"
              fill={false}
              width={700}
              height={500}
              className="w-full h-full object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </SectionContainer>
    </motion.section>
  );
} 