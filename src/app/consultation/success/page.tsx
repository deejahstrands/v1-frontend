'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import { Button } from '@/components/ui/button';

export default function ConsultationSuccessPage() {
  return (
    <div className="pb-8 lg:pb-12">
      <BannerSection
        title="CONSULTATION BOOKED"
        description="Your consultation has been successfully booked"
        bgImage="/images/banner.svg"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Consultation', href: '/consultation' },
              { label: 'Success' }
            ]}
          />
        }
      />

      <SectionContainer className="py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Consultation Booked Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for booking your consultation. We&apos;ll contact you soon to confirm your appointment details.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              You will receive an email confirmation shortly with your consultation details and next steps.
            </p>
            <p className="text-sm text-gray-600">
              If you have any questions, please contact our support team.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/account#consultation" className="block">
              <Button variant="outline" className="w-full">
                View Consultations
              </Button>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
