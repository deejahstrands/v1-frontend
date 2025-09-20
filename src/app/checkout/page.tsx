'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AddressPreview } from '@/components/checkout/address-preview';
import { AddressForm } from '@/components/checkout/address-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { useAddress } from '@/store/use-address';
import { useCart } from '@/store/use-cart';
import { useAuth } from '@/store/use-auth';
import { useToast } from '@/hooks/use-toast';
import { checkoutService } from '@/services/checkout';
import type { Address } from '@/services/address';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, totalPrice } = useCart();
  const {  selectedAddress, fetchAddresses } = useAddress();
  const { toast } = useToast();

  const [isHydrated, setIsHydrated] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login?returnUrl=/checkout');
      return;
    }
  }, [isHydrated, isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isHydrated && isAuthenticated && items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [isHydrated, isAuthenticated, items.length, router]);

  // Fetch addresses on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleAddressFormSuccess = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleAddressFormCancel = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.streetAddress,
      address.apartment,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setIsProcessing(true);
    
    try {
      const callbackUrl = process.env.NEXT_PUBLIC_CHECKOUT_SUCCESS_URL;
      const cancelUrl = process.env.NEXT_PUBLIC_CHECKOUT_CANCEL_URL;
      
      if (!callbackUrl || !cancelUrl) {
        throw new Error('Checkout URLs not configured');
      }
      
      const checkoutData = {
        deliveryNote: deliveryNote || '',
        shippingAddress: formatAddress(selectedAddress),
        callbackUrl,
        cancelUrl,
      };

      const response = await checkoutService.checkout(checkoutData);
      
      // Redirect to Paystack payment page
      window.location.href = response.data.authorization_url;
      
    } catch {
      toast.error('Failed to initiate checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="pb-8 lg:pb-12">
      <BannerSection
        title="CHECK OUT"
        description="Complete your order below"
        bgImage="/images/bg2.svg"
        disableAnimation={!isHydrated}
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
              { label: 'Checkout' }
            ]}
          />
        }
      />

      <SectionContainer>
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <h2 className="text-xl md:text-2xl font-ethereal font-semibold">CHECKOUT</h2>
            
            {/* Address Section */}
            {showAddressForm ? (
              <AddressForm
                editingAddress={editingAddress}
                onCancel={handleAddressFormCancel}
                onSuccess={handleAddressFormSuccess}
              />
            ) : (
              <AddressPreview
                onAddAddress={handleAddAddress}
                onEditAddress={handleEditAddress}
              />
            )}

            {/* Delivery Note */}
            {!showAddressForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Note (Optional)
                </h3>
                <Textarea
                  placeholder="Add any special instructions for your delivery..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {/* Payment Section */}
            {!showAddressForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 flex-shrink-0">
                    <Image
                      src="/icons/paystack_logo.svg"
                      alt="Paystack"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment with Paystack</p>
                    <p className="text-sm text-gray-500">
                      All transactions are secured and encrypted
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  Note: You&apos;ll be redirected to a secure payment page
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <OrderSummary />
            
            {!showAddressForm && (
              <div className="mt-6">
                <Button
                  onClick={handleCheckout}
                  disabled={!selectedAddress || isProcessing}
                  className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white font-semibold rounded-lg py-3 text-base transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Complete Order - ${totalPrice ? `₦${totalPrice.toLocaleString()}` : '₦0'}`
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  By continuing, you agree to our{' '}
                  <a href="/terms" className="underline hover:text-gray-700">
                    Terms of Service
                  </a>{' '}
                  and acknowledge the{' '}
                  <a href="/privacy" className="underline hover:text-gray-700">
                    Privacy Policy
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
