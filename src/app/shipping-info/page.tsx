"use client";

import React from 'react';
import { BannerSection } from '@/components/common/banner-section';
import { SectionContainer } from '@/components/common/section-container';
import ShippingInfoContent from '@/components/common/others-accordion/ShippingInfoContent';

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection
        title="Shipping Information"
        description="Processing timelines, delivery windows and return policy."
      />
      <div className="py-12">
        <SectionContainer>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <ShippingInfoContent />
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}


