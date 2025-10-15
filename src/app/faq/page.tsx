"use client";

import React from 'react';
import { BannerSection } from '@/components/common/banner-section';
import { SectionContainer } from '@/components/common/section-container';
import FAQContent from '@/components/common/others-accordion/FAQContent';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection
        title="FAQ"
        description="Answers to common questions about our wigs and services."
      />
      <div className="py-12">
        <SectionContainer>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <FAQContent />
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}


