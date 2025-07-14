import { SectionContainer } from "@/components/common/section-container";
import { Banner } from "@/components/common/banner";
import Link from "next/link";
import { products } from "@/data/products";
import { DealsCard } from "@/components/common/deals-card";
import { ProductCard } from "@/components/common/product-card";
import { Package } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  
  // Filter products by category
  const categoryProducts = products.filter(product => product.category === categoryName);

  return (
    <>
      <Banner
        title={categoryName}
        description={`Explore our collection of ${categoryName.toLowerCase()} products`}
        breadcrumb={
          <>
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:underline">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{categoryName}</span>
          </>
        }
        bgImage="/images/banner.svg"
      />
      <SectionContainer className="my-8 pb-8 lg:pb-24">
        {categoryProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              No products found in the &quot;{categoryName}&quot; category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 lg:mt-20">
            {categoryProducts.map((product) =>
              product.dealPrice ? (
                <DealsCard key={product.id} {...product} />
              ) : (
                <ProductCard key={product.id} {...product} />
              )
            )}
          </div>
        )}
      </SectionContainer>
    </>
  );
} 