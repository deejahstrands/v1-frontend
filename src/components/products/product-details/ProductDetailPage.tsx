"use client";

import { SectionContainer } from "@/components/common/section-container";
import Breadcrumb from "./Breadcrumb";
import dynamic from "next/dynamic";
import ProductInfoPanel from "./ProductInfoPanel";
import ProductTabs from "./ProductTabs";
import { Product } from "@/store/use-products";
import ProductCustomization from "./ProductCustomization";
import ConsultationCard from "./ConsultationCard";
import ProductDeliveryAccordion from "./ProductDeliveryAccordion";
import AddToCartSection from "./AddToCartSection";

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
          {/* Right Side: Product Info */}
          <div className="lg:col-span-5">
            <ProductInfoPanel product={product} />
            <ProductCustomization customizations={product.customizations || []} />
            <ConsultationCard />
            <ProductDeliveryAccordion delivery={product.delivery || []} />
            <AddToCartSection product={product} />
            {/* ProductTabs (mobile only) */}
            <div className="block lg:hidden mt-6">
              <ProductTabs description={<div>{product.description}</div>} product={product} />
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
} 