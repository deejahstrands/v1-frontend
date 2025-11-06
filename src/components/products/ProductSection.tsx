'use client'

import React, { useState, useRef, useEffect } from "react";
import { ProductCard } from "@/components/common/product-card";
import { Pagination } from "@/components/ui/pagination";
import { SectionContainer } from "@/components/common/section-container";
import { useProductGrid } from "@/store/use-product-grid";
import { useProducts } from "@/store/use-products";
import { motion } from "motion/react";
import { Package } from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

export function ProductSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const { grid } = useProductGrid();
  const {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    fetchProducts
  } = useProducts();

  // Intersection Observer for "ease in view" animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const cards = document.querySelectorAll('[data-index]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [currentPage, products]);

  const handlePageChange = (newPage: number) => {
    fetchProducts({
      page: newPage,
      limit: PRODUCTS_PER_PAGE
    });
    setVisibleItems(new Set()); // Reset visible items on page change
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Responsive grid: 2 columns on mobile and md, grid columns from store on lg
  const gridClass = `grid grid-cols-2 md:grid-cols-2 ${grid === 2 ? "lg:grid-cols-2" : grid === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`;

  // Loading state
  if (loading) {
    return (
      <SectionContainer className="py-8">
        <div className={gridClass}>
          {[...Array(PRODUCTS_PER_PAGE)].map((_, idx) => (
            <div key={idx} className="bg-gray-200 animate-pulse rounded-lg aspect-square" />
          ))}
        </div>
      </SectionContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <SectionContainer className="py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Products</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </SectionContainer>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <SectionContainer className="py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
          <p className="text-gray-500">No products are currently available.</p>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer className="py-8">
      <div ref={gridRef} className={gridClass}>
        {products.map((product, index) => (
          <motion.div
            key={`${product.id}-${currentPage}`}
            data-index={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={visibleItems.has(index) ? {
              opacity: 1,
              y: 0,
              scale: 1
            } : {
              opacity: 0,
              y: 30,
              scale: 0.95
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
          >
            <ProductCard
              id={product.id}
              images={product.thumbnail ? [product.thumbnail] : ['/images/placeholder-product.jpg']}
              title={product.name}
              price={`₦${product.basePrice.toLocaleString()}`}
              customization={product.customization}
              status={product.status}
            />
          </motion.div>
        ))}
      </div>
      {totalPages > 1 && (
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </SectionContainer>
  );
} 