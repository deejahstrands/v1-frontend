"use client";

import { SectionContainer } from "@/components/common/section-container";
import { SectionHeader } from "@/components/common/section-header";
import { CategoryCard } from "@/components/common/category-card";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

export function CategoriesSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="py-10 lg:py-16"
    >
      <SectionContainer>
        <SectionHeader
          title="Shop by Categories"
          description="From silky straight to bold blonde curls, find the style that's unapologetically you."
          buttonText="View All Categories"
          buttonHref="/shop"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {categories.slice(0, 4).map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <CategoryCard image={cat.image} name={cat.name} />
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </motion.section>
  );
} 