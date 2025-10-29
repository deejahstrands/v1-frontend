"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Thumbs, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import { createMediaItems } from "@/lib/media-utils";

interface ProductImageCarouselProps {
  images: string[];
  gallery?: Array<{ url: string; type: 'image' | 'video' }>;
  thumbnail?: string;
}

export default function ProductImageCarousel({ images, gallery, thumbnail }: ProductImageCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Create media items from thumbnail and gallery, fallback to images array
  const mediaItems = gallery && thumbnail 
    ? createMediaItems(thumbnail, gallery)
    : images?.map(url => ({ url, type: 'image' as const })).filter(item => item.url && item.url.trim() !== '') || [];
  
  if (!mediaItems || mediaItems.length === 0) return null;

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
        {mediaItems.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative aspect-[4/4] w-full bg-gray-100 rounded-xl overflow-hidden">
              {item.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster={thumbnail} // Use thumbnail as poster for video
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={`Product ${item.type} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 500px, 100vw"
                  priority={idx === 0}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
        {/* Custom navigation buttons (desktop only) */}
        <button
          ref={prevRef}
          className="custom-swiper-prev flex items-center justify-center absolute top-1/2 left-6 lg:left-10 -translate-y-1/2 -translate-x-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white shadow-md border border-gray-200 z-10 hover:bg-gray-100 transition cursor-pointer"
          aria-label="Previous image"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
        </button>
        <button
          ref={nextRef}
          className="custom-swiper-next flex items-center justify-center absolute top-1/2 right-6 lg:right-10 -translate-y-1/2 translate-x-1/2 w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white shadow-md border border-gray-200 z-10 hover:bg-gray-100 transition cursor-pointer"
          aria-label="Next image"
          type="button"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
        </button>
      </Swiper>

      {/* Thumbnails (desktop only) */}
      <div className="hidden lg:block mt-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={2}
          slidesPerView={Math.min(mediaItems.length, 4)}
          watchSlidesProgress
          modules={[Thumbs]}
          className="w-full"
        >
          {mediaItems.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative aspect-[4/5] w-[100px] h-[100px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {item.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-1">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
