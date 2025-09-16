"use client";

import React, { useState } from 'react';
import { BannerSection } from '@/components/common/banner-section';
import { WigTypeSelector } from '@/components/customization/wig-type-selector';
import { CustomizationAccordion } from '@/components/customization/customization-accordion';
import { CustomizationMeasurements } from '@/components/customization/customization-measurements';
import { SectionContainer } from '@/components/common/section-container';
import { wigTypes } from '@/data/customization';
import { useCustomization } from '@/store/use-customization';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomizationClient() {
  const { selectedWigType, getTotalPrice } = useCustomization();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding customized wig to cart:', {
      wigType: selectedWigType,
      totalPrice: getTotalPrice(),
      quantity
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <BannerSection
        title="MAKE IT YOURS"
        description="Design your perfect wig with our premium customization options. Every detail crafted to your unique style."
        breadcrumb={
          <div className="text-xs text-white/80">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2"> / </span>
            <span className="text-white">Customization</span>
          </div>
        }
        bgImage="/images/banner.svg"
      />

      {/* Main Content */}
      <div className="py-12">
        <SectionContainer>
          {/* Customization Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">
            {/* Left Column - Product Image */}
            <div className="lg:col-span-7 flex justify-center lg:justify-start">
              <div className="w-full">
                <div className="rounded-xl">
                  <Image
                    src="https://res.cloudinary.com/dhnanmyf3/image/upload/v1753709605/21_a4hxqz.jpg"
                    width={500}
                    height={500}
                    alt="Wig Customization"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - All Customization Options */}
            <div className="lg:col-span-5 space-y-8">
              {/* Product Description */}
              <div className="w-full max-w-md mx-auto">
                <p className="text-gray-700 leading-relaxed text-sm">
                  At Deejah Strands, we offer the ultimate in luxury and customization. From hair type to cut and color, 
                  you have complete control to create a bespoke unit that is uniquely yours. Stand out with a personalized 
                  wig that perfectly reflects your style and individuality.
                </p>
              </div>

              {/* Wig Type Selector */}
              <WigTypeSelector wigTypes={wigTypes} />

              {/* Customization Accordion */}
              <CustomizationAccordion />

              {/* Measurements & Preferences */}
              <CustomizationMeasurements />

              {/* Quantity & Actions */}
              {selectedWigType && (
                <div className="w-full max-w-md mx-auto">
                  {/* Quantity Selector */}
                  <div className="mb-6 flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity:
                      </label>
                    <div className="flex items-center border border-gray-300 rounded-lg w-32">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center py-2 font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full flex-1 flex items-center justify-center gap-2 bg-[#C9A18A] hover:bg-[#b88b6d] text-white font-semibold rounded-lg py-3 text-base transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </Button>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-4 text-xs text-gray-600 text-center">
                    Taxes included. Shipping calculated at checkout.
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}
