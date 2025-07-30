'use client';

import { BannerSection } from "@/components/products/BannerSection";
import { CategoriesSection } from "@/components/products/CategoriesSection";
import { FilterBar } from "@/components/products/FilterBar";
import { ProductSection } from "@/components/products/ProductSection";
import { useState, useEffect } from "react";
import { ShopLoadingSkeleton } from "@/components/shop/shop-loading-skeleton";

export default function ShopPage() {
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <ShopLoadingSkeleton />;
  }

  return (
    <>
      <BannerSection />
      <CategoriesSection />
      <FilterBar />
      <ProductSection />
      {/* ...other sections */}
    </>
  );
} 