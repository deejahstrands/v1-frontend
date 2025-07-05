"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Thumbs, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";

interface ProductImageCarouselProps {
  images: string[];
}

export default function ProductImageCarousel({ images }: ProductImageCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!images || !Array.isArray(images) || images.length === 0) return null;

  return (
    <div className="relative">
      {/* Main Swiper */}
      <Swiper
        modules={[Thumbs, Navigation]}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-expect-error: Swiper navigation expects DOM element, React ref is used
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error: Swiper navigation expects DOM element, React ref is used
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="w-full rounded-xl overflow-hidden"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative aspect-[4/4] w-full bg-gray-100">
              <Image
                src={src}
                alt={`Product image ${idx + 1}`}
                fill
                className="object-cover rounded-xl"
                sizes="(min-width: 1024px) 500px, 100vw"
                priority={idx === 0}
              />
            </div>
          </SwiperSlide>
        ))}
        {/* Custom navigation buttons (desktop only) */}
        <button
          ref={prevRef}
          className="custom-swiper-prev hidden lg:flex items-center justify-center absolute top-1/2 left-10 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-lg bg-white shadow-md border border-gray-200 z-10 hover:bg-gray-100 transition"
          aria-label="Previous image"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <button
          ref={nextRef}
          className="custom-swiper-next hidden lg:flex items-center justify-center absolute top-1/2 right-10 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-lg bg-white shadow-md border border-gray-200 z-10 hover:bg-gray-100 transition"
          aria-label="Next image"
          type="button"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      </Swiper>

      {/* Thumbnails (desktop only) */}
      <div className="hidden lg:block mt-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={2}
          slidesPerView={Math.min(images.length, 4)}
          watchSlidesProgress
          modules={[Thumbs]}
          className="w-full"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative aspect-[4/5] w-[100px] h-[100px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={src}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
