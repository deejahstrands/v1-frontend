import { BannerSection } from "@/components/products/BannerSection";
import { CategoriesSection } from "@/components/products/CategoriesSection";
import { FilterBar } from "@/components/products/FilterBar";
import { ProductSection } from "@/components/products/ProductSection";

export default function ShopPage() {
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