'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import { Button } from '@/components/ui/button';

export default function ConsultationFailedPage() {
  return (
    <div className="pb-8 lg:pb-12">
      <BannerSection
        title="BOOKING FAILED"
        description="Your consultation booking could not be completed"
        bgImage="/images/banner.svg"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Consultation', href: '/consultation' },
              { label: 'Failed' }
            ]}
          />
        }
      />

      <SectionContainer className="py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Failed
            </h1>
            <p className="text-gray-600">
              We&apos;re sorry, but your consultation booking could not be completed at this time.
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-red-700 mb-2">
              This could be due to a payment issue or technical problem.
            </p>
            <p className="text-sm text-red-700">
              Please try again or contact our support team for assistance.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/consultation" className="block">
              <Button className="w-full">
                Try Again
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
