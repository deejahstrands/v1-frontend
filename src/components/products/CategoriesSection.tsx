"use client";
import { SectionContainer } from "@/components/common/section-container";
import { categories } from "@/data/categories";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const allCategory = {
  name: "All",
  image: categories[0].image,
};

export function CategoriesSection() {
  const displayCategories = [allCategory, ...categories];

  return (
    <SectionContainer className="hidden lg:block">
      <div className="flex gap-4 sm:gap-6 items-center sm:justify-center py-6 sm:py-10 overflow-x-auto flex-nowrap">
        {displayCategories.map((cat) => {
          return (
            <motion.div
              key={cat.name}
              className="flex flex-col items-center focus:outline-none group bg-transparent border-none flex-shrink-0"
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              <Link href={cat.name === "All" ? "/shop" : `/shop/category/${encodeURIComponent(cat.name)}`}>
                <motion.div
                  className="rounded-full overflow-hidden w-16 h-16 sm:w-16 sm:h-16 border-2 border-gray-200 transition-all duration-200 group-hover:border-primary group-hover:ring-2 group-hover:ring-primary"
                  variants={{
                    rest: { scale: 1, boxShadow: "0 0px 0px 0 rgba(0,0,0,0)" },
                    hover: { scale: 1.08, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.15)" },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image src={cat.image} alt={cat.name} width={64} height={64} className="object-cover w-full h-full sm:w-16 sm:h-16" />
                </motion.div>
                <span className="mt-2 text-xs sm:text-sm font-medium flex items-center gap-1 text-gray-700 group-hover:text-primary">
                  {cat.name}
                  <motion.span
                    className="inline-block"
                    variants={{
                      rest: { x: 0, opacity: 0.5 },
                      hover: { x: 8, opacity: 1 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ChevronRight size={16} />
                  </motion.span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </SectionContainer>
  );
} 