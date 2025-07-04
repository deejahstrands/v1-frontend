'use client'

import { useState, useRef } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/common/product-card";
import { Pagination } from "@/components/ui/pagination";
import { SectionContainer } from "@/components/common/section-container";
import { useProductGrid } from "@/store/use-product-grid";
import { motion, useInView, AnimatePresence } from "motion/react";

const PRODUCTS_PER_PAGE = 12;

export function ProductSection() {
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const { grid } = useProductGrid();
  const isInView = useInView(gridRef, { once: false, amount: 0.1 });

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginated = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Responsive grid: 2 columns on mobile and md, grid columns from store on lg
  const gridClass = `grid grid-cols-2 md:grid-cols-2 ${grid === 2 ? "lg:grid-cols-2" : grid === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`;

  return (
    <SectionContainer className="py-8">
      <div ref={gridRef} className={gridClass}>
        <AnimatePresence mode="wait">
          {paginated.map((product, index) => (
            <motion.div
              key={`${product.id}-${page}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {totalPages > 1 && (
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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