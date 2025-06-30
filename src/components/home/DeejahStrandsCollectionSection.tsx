"use client";

import { SectionHeader } from "@/components/common/section-header";
import { products } from "@/data/products";
import { ProductCard } from "@/components/common/product-card";
import { SectionContainer } from "@/components/common/section-container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";

export function DeejahStrandsCollectionSection() {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const prevMobileRef = useRef<HTMLButtonElement>(null);
    const nextMobileRef = useRef<HTMLButtonElement>(null);

    return (
        <section className="py-10 lg:py-16">
            <SectionContainer>
                <SectionHeader
                    title="Deejah Strands Collection"
                    description="Explore our most loved wigs and bundles—rated by real Deejah beauties."
                    buttonText="See More"
                    buttonHref="/collections"
                />
                <div className="relative">
                    {/* Mobile navigation overlay */}
                    <div className="block md:hidden">
                        <button
                            ref={prevMobileRef}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center border border-gray-200"
                            aria-label="Previous"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            ref={nextMobileRef}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center border border-gray-200"
                            aria-label="Next"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                        }}
                        navigation={{
                            prevEl: typeof window !== "undefined" && window.innerWidth < 768 ? prevMobileRef.current : prevRef.current,
                            nextEl: typeof window !== "undefined" && window.innerWidth < 768 ? nextMobileRef.current : nextRef.current,
                        }}
                        onInit={(swiper) => {
                            // @ts-expect-error: Swiper navigation expects DOM element, ref assignment is safe
                            swiper.params.navigation.prevEl = window.innerWidth < 768 ? prevMobileRef.current : prevRef.current;
                            // @ts-expect-error: Swiper navigation expects DOM element, ref assignment is safe
                            swiper.params.navigation.nextEl = window.innerWidth < 768 ? nextMobileRef.current : nextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard
                                    image={product.image}
                                    title={product.title}
                                    price={product.price}
                                    customization={product.customization}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Desktop navigation below carousel */}
                    <div className="hidden md:flex gap-2 justify-end mt-4">
                        <button
                            ref={prevRef}
                            className="w-9 h-9 rounded-md border border-gray-300 bg-black text-white flex items-center justify-center disabled:opacity-50"
                            aria-label="Previous"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            ref={nextRef}
                            className="w-9 h-9 rounded-md border border-gray-300 bg-black text-white flex items-center justify-center disabled:opacity-50"
                            aria-label="Next"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </SectionContainer>
        </section>
    );
} 