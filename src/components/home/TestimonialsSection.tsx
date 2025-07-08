"use client";

import React from "react";
import { testimonials } from "@/data/testimonials";
import { SectionContainer } from "@/components/common/section-container";
import StarRating from "@/components/products/product-details/StarRating";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  return (
    <div className="bg-secondary py-12 lg:py-24">
      <SectionContainer>
        <div className="text-center mb-8">
          <h2 className=" text-2xl sm:text-3xl lg:text-3xl font-semibold mb-4 font-ethereal">What Our Customers Say</h2>
          <p className="text-gray-500  max-w-3xl mx-auto text-xs sm:text-sm lg:text-sm xl:text-base ">
            At Deejah Strands, our customers are the heartbeat of our brand. Explore the heartfelt testimonials shared by those who have experienced the magic of Deejah Strands.
          </p>
        </div>
        <div className="relative">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={24}
            navigation={{
              nextEl: ".testimonial-next",
              prevEl: ".testimonial-prev",
            }}
            pagination={{
              el: ".testimonial-pagination",
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="testimonial-bullet ${className}"></span>`
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="relative h-full min-h-[260px] w-[90%] mx-auto"
            style={{ minHeight: 260, width: '90%' }}
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={t.name + idx} className="flex h-full items-stretch">
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                  className="bg-white border-2 border-primary rounded-xl p-6 flex flex-col justify-between h-full min-h-[220px] transition-shadow shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Image src={t.avatar} alt={t.name} width={40} height={40} className={`w-10 h-10 rounded-full ${t.avatar ? 'object-cover' : 'object-contain'}`} />
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <StarRating rating={t.rating} size={14} />
                    </div>
                    <Image
                      src="/quote.svg"
                      alt="Quote"
                      width={32}
                      height={32}
                      className="ml-auto w-6 h-6 sm:w-6 sm:h-6  object-contain"
                      priority={false}
                    />
                  </div>
                  <div className="text-gray-700 text-base mt-4 flex-1 flex items-start">{t.text}</div>
                </motion.div>
              </SwiperSlide>
            ))}

            <div className="testimonial-pagination flex justify-center mt-8" />
          </Swiper>
        </div>
        <style jsx global>{`
          .testimonial-pagination {
            gap: 12px;
          }
          .testimonial-bullet {
            display: inline-block;
            height: 10px;
            border-radius: 9999px;
            background: #fff;
            opacity: 1;
            width: 18px;
            transition: all 0.2s;
            margin: 0 3px;
          }
          .testimonial-bullet.swiper-pagination-bullet-active {
            background: #C9A18A;
            width: 40px;
          }
        `}</style>
      </SectionContainer>
    </div>
  );
} 