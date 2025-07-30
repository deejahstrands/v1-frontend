"use client";

import { SectionContainer } from "@/components/common/section-container";
import Breadcrumb from "./Breadcrumb";
import dynamic from "next/dynamic";
import ProductInfoPanel from "./ProductInfoPanel";
import ProductTabs from "./ProductTabs";
import { Product } from "@/store/use-products";
import ProductCustomization from "./ProductCustomization";
import ProductDeliveryAccordion from "./ProductDeliveryAccordion";
import AddToCartSection from "./AddToCartSection";
import OthersAccordion from "@/components/common/others-accordion/OthersAccordion";
import RelatedProductsSection from "./RelatedProductsSection";
import { MeasurementsAndPreferences } from "./MeasurementsAndPreferences";

const ProductImageCarousel = dynamic(() => import("./ProductImageCarousel"), { ssr: false });

export default function ProductDetailPage({ product }: { product: Product }) {
  return (
    <div className="bg-tertiary my-8 pb-8">
      <SectionContainer>
        {/* Breadcrumb row (Back arrow, Go Back, Shop / Product Name) */}
        <div className="mb-4">
          <Breadcrumb productName={product.title} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Images + Tabs (desktop) */}
          <div className="lg:col-span-7">
            <ProductImageCarousel images={product.images} />
            <div className="hidden lg:block mt-8">
              {/* ProductTabs (desktop only) */}
              <ProductTabs description={<div>{product.description}</div>} product={product} />
            </div>
          </div>
          {/* Right Side: Product Info with fixed height and internal scrolling */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-6">
                <ProductInfoPanel product={product} />
                <ProductCustomization customizations={product.customizations || []} />
                {product.customization && (
                  <div>
                    <MeasurementsAndPreferences />
                  </div>
                )}
                <ProductDeliveryAccordion delivery={product.delivery || []} />
                <AddToCartSection product={product} />
                {/* ProductTabs (mobile only) */}
                <div className="block lg:hidden">
                  <ProductTabs description={<div>{product.description}</div>} product={product} />
                </div>
                <OthersAccordion />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
      <RelatedProductsSection />
    </div>
  );
} 