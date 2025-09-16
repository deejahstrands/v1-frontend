"use client";

import { SectionContainer } from "@/components/common/section-container";
import { Banner } from "@/components/common/banner";
import Link from "next/link";
import { ProductCard } from "@/components/common/product-card";
import { Pagination } from "@/components/ui/pagination";
import { useCollections } from "@/store/use-collections";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";

export default function CollectionsClient() {
  const {
    featuredCollection,
    featuredLoading,
    featuredError,
    fetchFeaturedCollection
  } = useCollections();

  // Frontend pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchFeaturedCollection();
  }, [fetchFeaturedCollection]);

  const products = featuredCollection?.products || [];
  
  // Filter out products with missing required data
  const validProducts = products.filter(product => 
    product && 
    product.id && 
    product.name && 
    typeof product.basePrice === 'number'
  );

  // Frontend pagination calculations
  const totalItems = validProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = validProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (featuredLoading) {
    return (
      <>
        <Banner
          title="Loading Collection..."
          description="Please wait while we fetch the collection."
          breadcrumb={
            <>
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Collections</span>
            </>
          }
          bgImage="/images/banner.svg"
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

  if (featuredError) {
    return (
      <>
        <Banner
          title="Collections"
          description="Unable to load the collection at this time."
          breadcrumb={
            <>
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Collections</span>
            </>
          }
          bgImage="/images/banner.svg"
        />
        <SectionContainer className="my-8 pb-8 lg:pb-24">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Collection</h3>
            <p className="text-gray-500">{featuredError}</p>
          </div>
        </SectionContainer>
      </>
    );
  }

  return (
    <>
      <Banner
        title={featuredCollection?.name || "Collections"}
        description={featuredCollection?.description || "Explore our featured collection"}
        breadcrumb={
          <>
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Collections</span>
          </>
        }
        bgImage="/images/banner.svg"
      />
      <SectionContainer className="my-8 pb-8 lg:pb-24">
        {/* Collection Info */}
        {featuredCollection && (
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {currentProducts.length} of {totalItems} products
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 lg:mt-20">
          {currentProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500">This collection doesn&apos;t have any products yet.</p>
            </div>
          ) : (
            currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                images={product.thumbnail ? [product.thumbnail] : ['/images/placeholder-product.jpg']}
                title={product.name || 'Product'}
                price={`₦${(product.basePrice || 0).toLocaleString()}`}
                customization={product.customization || false}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        )}
      </SectionContainer>
    </>
  );
}
