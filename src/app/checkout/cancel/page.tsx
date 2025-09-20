'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';
import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  return (
    <div className="pb-8 lg:pb-12">
      <BannerSection
        title="ORDER CANCELLED"
        description="Your payment was cancelled and no charges were made"
        bgImage="/images/bg2.svg"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
              { label: 'Checkout', href: '/checkout' },
              { label: 'Cancel' }
            ]}
          />
        }
      />

      <SectionContainer className="py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Cancelled
            </h1>
            <p className="text-gray-600">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Your cart items are still saved and waiting for you.
            </p>
            <p className="text-sm text-gray-600">
              You can complete your purchase anytime or continue shopping.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/cart" className="block">
              <Button className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Cart
              </Button>
            </Link>
            
            <Link href="/shop" className="block">
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
