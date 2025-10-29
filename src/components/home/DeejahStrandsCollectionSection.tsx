"use client";

import { SectionHeader } from "@/components/common/section-header";
import { ProductCard } from "@/components/common/product-card";
import { SectionContainer } from "@/components/common/section-container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useCollections } from "@/store/use-collections";

export function DeejahStrandsCollectionSection() {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const prevMobileRef = useRef<HTMLButtonElement>(null);
    const nextMobileRef = useRef<HTMLButtonElement>(null);

    const {
        featuredCollection,
        featuredLoading,
        featuredError,
        fetchFeaturedCollection
    } = useCollections();

    useEffect(() => {
        fetchFeaturedCollection();
    }, [fetchFeaturedCollection]);

    if (featuredLoading) {
        return (
            <motion.section
                className="py-10 lg:py-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
            >
                <SectionContainer>
                    <SectionHeader
                        title="Loading Collection..."
                        description="Please wait while we fetch the featured collection."
                        buttonText="See More"
                        buttonHref="/collections"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="bg-gray-200 animate-pulse rounded-lg aspect-square" />
                        ))}
                    </div>
                </SectionContainer>
            </motion.section>
        );
    }

    if (featuredError) {
        return (
            <motion.section
                className="py-10 lg:py-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
            >
                <SectionContainer>
                    <SectionHeader
                        title="Deejah Strands Collection"
                        description="Unable to load the featured collection at this time."
                        buttonText="See More"
                        buttonHref="/collections"
                    />
                </SectionContainer>
            </motion.section>
        );
    }

    const products = featuredCollection?.products?.data || [];

    // Filter out products with missing required data
    const validProducts = products.filter(product =>
        product &&
        product.id &&
        product.name &&
        typeof product.basePrice === 'number'
    );

    // Don't render the section if there are no valid products
    if (validProducts.length === 0) {
        return null;
    }

    return (
        <motion.section
            className="py-10 lg:py-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            <SectionContainer>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: 0.2
                    }}
                >
                    <SectionHeader
                        title={featuredCollection?.name || "Deejah Strands Collection"}
                        description={featuredCollection?.description || "Explore our most loved wigs and bundles—rated by real Deejah beauties."}
                        buttonText="See More"
                        buttonHref="/collections"
                    />
                </motion.div>
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: 0.4
                    }}
                >
                    {/* Mobile navigation overlay */}
                    <div className="block md:hidden">
                        <motion.button
                            ref={prevMobileRef}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center border border-gray-200"
                            aria-label="Previous"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronLeft />
                        </motion.button>
                        <motion.button
                            ref={nextMobileRef}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center border border-gray-200"
                            aria-label="Next"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronRight />
                        </motion.button>
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
                        {validProducts.map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                        delay: 0.6 + (index * 0.1)
                                    }}
                                    whileHover={{ y: -8 }}
                                >
                                    <ProductCard
                                        id={product.id}
                                        images={product.thumbnail ? [product.thumbnail] : ['/images/placeholder-product.jpg']}
                                        title={product.name || 'Product'}
                                        price={`₦${(product.basePrice || 0).toLocaleString()}`}
                                        customization={product.customization || false}
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* Desktop navigation below carousel */}
                    <div className="hidden md:flex gap-2 justify-end mt-4">
                        <motion.button
                            ref={prevRef}
                            className="w-9 h-9 rounded-md border border-gray-300 bg-black text-white flex items-center justify-center disabled:opacity-50"
                            aria-label="Previous"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronLeft />
                        </motion.button>
                        <motion.button
                            ref={nextRef}
                            className="w-9 h-9 rounded-md border border-gray-300 bg-black text-white flex items-center justify-center disabled:opacity-50"
                            aria-label="Next"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronRight />
                        </motion.button>
                    </div>
                </motion.div>
            </SectionContainer>
        </motion.section>
    );
} 