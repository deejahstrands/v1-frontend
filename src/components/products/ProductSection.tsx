'use client'

import React, { useState, useRef, useEffect } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/common/product-card";
import { Pagination } from "@/components/ui/pagination";
import { SectionContainer } from "@/components/common/section-container";
import { useProductGrid } from "@/store/use-product-grid";
import { motion } from "motion/react";

const PRODUCTS_PER_PAGE = 12;

export function ProductSection() {
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const { grid } = useProductGrid();

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginated = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

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
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setVisibleItems(new Set()); // Reset visible items on page change
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Responsive grid: 2 columns on mobile and md, grid columns from store on lg
  const gridClass = `grid grid-cols-2 md:grid-cols-2 ${grid === 2 ? "lg:grid-cols-2" : grid === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`;

  return (
    <SectionContainer className="py-8">
      <div ref={gridRef} className={gridClass}>
        {paginated.map((product, index) => (
          <motion.div
            key={`${product.id}-${page}`}
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
            <ProductCard {...product} />
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
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </SectionContainer>
  );
} 