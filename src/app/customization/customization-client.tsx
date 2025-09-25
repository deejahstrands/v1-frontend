/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { BannerSection } from '@/components/common/banner-section';
import { WigTypeSelector } from '@/components/customization/wig-type-selector';
import { CustomizationAccordion } from '@/components/customization/customization-accordion';
import { CustomizationMeasurements } from '@/components/customization/customization-measurements';
import { SectionContainer } from '@/components/common/section-container';
import { useCustomization } from '@/store/use-customization';
import { useCustomizationMeasurements } from '@/store/use-customization-measurements';
import { useWigUnits } from '@/store/use-wig-units';
import { cartService } from '@/services/cart';
import { uploadService } from '@/services/upload';
import { useAuth } from '@/store/use-auth';
import { useCart } from '@/store/use-cart';
import { useLoginModal } from '@/hooks/use-login-modal';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomizationClient() {
  const { selectedWigType, setSelectedWigType, selectedOptions, reset } = useCustomization();
  const measurements = useCustomizationMeasurements((s) => s.data);
  const resetMeasurements = useCustomizationMeasurements((s) => s.reset);
  const { list, selected, loading, fetchList, fetchOne } = useWigUnits();
  const { isAuthenticated } = useAuth();
  const { openModal } = useLoginModal();
  const fetchCart = useCart((s) => s.fetchCart);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch wig units on mount (no page/limit sent)
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // When a wig unit detail is fetched, map it into the customization store structure
  useEffect(() => {
    if (!selected) return;
    const mapped = {
      id: selected.id,
      name: selected.name,
      basePrice: selected.basePrice,
      customizations: selected.customizations.map((c) => ({
        type: c.typeName,
        options: c.options.map((o) => ({ label: o.name, price: o.price })),
      })),
    } as any;
    setSelectedWigType(mapped);
  }, [selected, setSelectedWigType]);

  // Helper to translate selected option labels back to API IDs
  const selectedOptionIds = useMemo(() => {
    if (!selected) return [] as string[];
    const ids: string[] = [];
    selected.customizations.forEach((c) => {
      const chosen = selectedOptions[c.typeName];
      if (chosen?.label) {
        const match = c.options.find((o) => o.name === chosen.label);
        if (match) ids.push(match.itemCustomizationId);
      }
    });
    return ids;
  }, [selected, selectedOptions]);

  // When a wig type is chosen in the selector, fetch its detail
  useEffect(() => {
    if (selectedWigType?.id) {
      fetchOne(selectedWigType.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWigType?.id]);

  const handleAddToCart = async () => {
    if (!selected || !selectedWigType) return;

    // Auth gate
    if (!isAuthenticated) {
      openModal('Login to continue', async () => {
        // noop; user will retry
      });
      return;
    }

    try {
      setIsAdding(true);
      // Upload measurement images if provided
      let harlineImages: string[] = [];
      let wigStyleImages: string[] = [];
      if (measurements.hasMeasurements) {
        if (measurements.hairlinePictures && measurements.hairlinePictures instanceof File) {
          const url = await uploadService.uploadFile(measurements.hairlinePictures);
          harlineImages = [url];
        }
        if (measurements.styleReference && measurements.styleReference instanceof File) {
          const url = await uploadService.uploadFile(measurements.styleReference);
          wigStyleImages = [url];
        }
      }

      await cartService.addToCart({
        wigUnitId: selected.id,
        quantity,
        customizations: selectedOptionIds,
        measurements: {
          earToEar: measurements.earToEar || undefined,
          headCircumference: measurements.headCircumference || undefined,
          harlineImages: harlineImages.length ? harlineImages : undefined,
          wigStyleImages: wigStyleImages.length ? wigStyleImages : undefined,
        },
      });
      toast.success('Customized wig added to cart');
      // Refresh cart badge
      fetchCart();
      // Reset selections and measurements
      reset();
      resetMeasurements();
      setQuantity(1);
    } catch (e) {
      toast.error('Failed to add to cart');
      console.error(e);
    } finally {
      setIsAdding(false);
    }
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

              {/* Wig Type Selector (driven by wig units list) */}
              <WigTypeSelector
                wigTypes={list.map((w) => ({
                  id: w.id,
                  name: w.name,
                  basePrice: w.basePrice,
                  customizations: [],
                })) as any}
              />

              {/* Customization Section */}
              {selectedWigType ? (
                loading ? (
                  <div className="w-full max-w-md mx-auto border border-[#98A2B3] rounded-2xl p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-2/3" />
                      <div className="h-10 bg-gray-200 rounded" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                ) : selected && selected.customizations && selected.customizations.length > 0 ? (
                  <CustomizationAccordion />
                ) : (
                  <div className="w-full max-w-md mx-auto border border-[#98A2B3] rounded-2xl p-4 text-sm text-gray-600">
                    No customization options available for the selected wig unit.
                  </div>
                )
              ) : null}

              {/* Measurements & Preferences */}
              <CustomizationMeasurements />

              {/* Quantity & Actions */}
              {selectedWigType && !loading && selected && selected.customizations && selected.customizations.length > 0 && (
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
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center py-2 font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="w-full flex-1 flex items-center justify-center gap-2 bg-[#C9A18A] hover:bg-[#b88b6d] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-base transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
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
