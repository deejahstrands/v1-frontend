"use client";

import React from 'react';
import { BannerSection } from '@/components/common/banner-section';
import { SectionContainer } from '@/components/common/section-container';
import DisclaimersContent from '@/components/common/others-accordion/DisclaimersContent';

export default function DisclaimersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection
        title="Disclaimers"
        description="Important information on colors, textures, length and readiness."
      />
      <div className="py-12">
        <SectionContainer>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <DisclaimersContent />
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}


