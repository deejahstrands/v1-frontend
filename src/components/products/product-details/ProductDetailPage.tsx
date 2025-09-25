"use client";

import { SectionContainer } from "@/components/common/section-container";
import Breadcrumb from "./Breadcrumb";
import dynamic from "next/dynamic";
import ProductInfoPanel from "./ProductInfoPanel";
import ProductTabs from "./ProductTabs";
// import { DetailedProduct } from "@/types/product";
import ProductCustomization from "./ProductCustomization";
import ProductDeliveryAccordion from "./ProductDeliveryAccordion";
import AddToCartSection from "./AddToCartSection";
import OthersAccordion from "@/components/common/others-accordion/OthersAccordion";
import RelatedProductsSection from "./RelatedProductsSection";
import { MeasurementsAndPreferences } from "./MeasurementsAndPreferences";

const ProductImageCarousel = dynamic(() => import("./ProductImageCarousel"), { ssr: false });

interface ProductDetailPageProps {
  product: {
    id: string;
    title: string;
    name: string;
    price: string;
    basePrice: number;
    images: string[];
    gallery?: Array<{ url: string; type: 'image' | 'video' }>;
    thumbnail?: string;
    description: string;
    customization: boolean;
    customizations?: Array<{
      typeId: string;
      typeName: string;
      type: string;
      description: string;
      options: Array<{
        itemCustomizationId: string;
        customizationId: string;
        name: string;
        label: string;
        description: string;
        price: number;
        status: string;
      }>;
    }>;
    privateFittings?: Array<{
      productFittingOptionId: string;
      fittingOptionId: string;
      name: string;
      price: number;
    }>;
    processingTimes?: Array<{
      productProcessingTimeId: string;
      processingTimeId: string;
      label: string;
      price: number;
    }>;
    productSpecifications?: Record<string, string>;
    category?: string;
    delivery?: Array<{
      type: string;
      options: Array<Record<string, unknown>>;
    }>;
    specifications?: Array<{
      type: string;
      value: string;
    }>;
    reviews?: Array<{
      user: {
        id: string;
        avatar: string;
        lastName: string;
        firstName: string;
      };
      rating: number;
      review: string;
    }>;
    relatedProducts?: Array<{
      id: string;
      name: string;
      thumbnail: string;
      description: string;
      status: string;
      visibility: string;
      basePrice: number;
      customization: boolean;
    }>;
    [key: string]: unknown;
  };
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
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
            <ProductImageCarousel 
              images={product.images} 
              gallery={product.gallery}
              thumbnail={product.thumbnail}
            />
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
                {product.customizations && product.customizations.length > 0 && (
                  <ProductCustomization customizations={product.customizations} />
                )}
                {product.customizations && product.customizations.length > 0 && (
                  <div>
                    <MeasurementsAndPreferences />
                  </div>
                )}
                <ProductDeliveryAccordion delivery={(product.delivery as Array<{ type: string; options: Array<{ label: string; price: number; }> }>) || []} />
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
      <RelatedProductsSection relatedProducts={product.relatedProducts} />
    </div>
  );
} 