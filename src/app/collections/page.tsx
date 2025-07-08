import { SectionContainer } from "@/components/common/section-container";
import { Banner } from "@/components/common/banner";
import Link from "next/link";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { DealsCard } from "@/components/common/deals-card";
import { ProductCard } from "@/components/common/product-card";

export default function CollectionsPage() {
  const collection = collections[0];
  const collectionProducts = products.filter(p => collection.productIds.includes(p.id));
  return (
    <>
      <Banner
        title={collection.title}
        description={collection.description}
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
          {collectionProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">No products in this collection.</div>
          ) : (
            collectionProducts.map((product) =>
              product.dealPrice ? (
                <DealsCard key={product.id} {...product} />
              ) : (
                <ProductCard key={product.id} {...product} />
              )
            )
          )}
        </div>
      </SectionContainer>
    </>
  );
} 