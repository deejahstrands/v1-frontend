"use client";

import { SectionContainer } from "@/components/common/section-container";
import { Banner } from "@/components/common/banner";
import Link from "next/link";
import { products } from "@/data/products";
import { DealsCard } from "@/components/common/deals-card";

export default function DealsClient() {
  const deals = products.filter((p) => p.dealPrice);
  
  return (
    <>
      <Banner
        title="Deals & Discounts"
        description="Discover the best deals on luxury wigs, bundles, and more. Enjoy exclusive discounts for a limited time only!"
        breadcrumb={
          <>
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Deals</span>
          </>
        }
        bgImage="/images/banner.jpg"
      />
      <SectionContainer className="my-8 pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 font-ethereal">Deals</h1>
        <p className="text-gray-600 text-base mb-6">Browse all products currently on deal. Amazing discounts await!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">No deals available at the moment.</div>
          ) : (
            deals.map((product) => (
              <DealsCard key={product.id} {...product} />
            ))
          )}
        </div>
      </SectionContainer>
    </>
  );
}
