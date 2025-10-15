"use client";

import { SectionContainer } from "@/components/common/section-container";
import { Banner } from "@/components/common/banner";
import Link from "next/link";
import { ProductCard } from "@/components/common/product-card";
import { Package } from "lucide-react";
import { useCategories } from "@/store/use-categories";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/ui/pagination";

interface CategoryClientProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryClient({ params }: CategoryClientProps) {
  const {
    currentCategory,
    categoryLoading,
    categoryError,
    fetchCategoryWithProducts,
    resetCurrentCategory,
    productPage,
    productTotalPages,
  } = useCategories();

  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    async function getCategoryId() {
      const resolvedParams = await params;
      setCategoryId(resolvedParams.id);
    }
    getCategoryId();
  }, [params]);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryWithProducts(categoryId, { page: 1, limit: 12 });
    }
    
    return () => {
      resetCurrentCategory();
    };
  }, [categoryId, fetchCategoryWithProducts, resetCurrentCategory]);

  const handlePageChange = (page: number) => {
    if (categoryId) {
      fetchCategoryWithProducts(categoryId, { page, limit: 12 });
    }
  };

  if (categoryLoading) {
    return (
      <>
        <Banner
          title="Loading..."
          description="Loading category products..."
          breadcrumb={
            <>
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/shop" className="hover:underline">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Loading...</span>
            </>
          }
          bgImage="/images/banner.jpg"
        />
        <SectionContainer className="my-8 pb-8 lg:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 lg:mt-20">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-gray-200 animate-pulse rounded-lg aspect-square" />
            ))}
          </div>
        </SectionContainer>
      </>
    );
  }

  if (categoryError) {
    return (
      <>
        <Banner
          title="Error"
          description="Failed to load category"
          breadcrumb={
            <>
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/shop" className="hover:underline">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Error</span>
            </>
          }
          bgImage="/images/banner.jpg"
        />
        <SectionContainer className="my-8 pb-8 lg:pb-24">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Category</h3>
            <p className="text-gray-500">{categoryError}</p>
          </div>
        </SectionContainer>
      </>
    );
  }

  const displayName = currentCategory?.name || "Category";
  const products = currentCategory?.products?.data || [];

  return (
    <>
      <Banner
        title={displayName}
        description={currentCategory?.description || `Explore our collection of ${displayName.toLowerCase()} products`}
        breadcrumb={
          <>
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:underline">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{displayName}</span>
          </>
        }
        bgImage="/images/banner.jpg"
      />
      <SectionContainer className="my-8 pb-8 lg:pb-24">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              No products found in the &quot;{displayName}&quot; category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 lg:mt-20">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  title={product.name}
                  price={`₦${product.basePrice.toLocaleString()}`}
                  images={product.thumbnail ? [product.thumbnail] : ['/images/placeholder-product.jpg']}
                  customization={product.customization || false}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {productTotalPages > 1 && (
              <Pagination
                totalPages={productTotalPages}
                currentPage={productPage}
                onPageChange={handlePageChange}
                className="mt-12"
              />
            )}
          </>
        )}
      </SectionContainer>
    </>
  );
}
