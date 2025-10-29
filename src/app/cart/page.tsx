/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/use-cart';
import { useAuth } from '@/store/use-auth';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { CartTotalsSection } from '@/components/cart/cart-totals-section';
import { EmptyCartState } from '@/components/cart/empty-cart-state';
import { CartLoadingSkeleton } from '@/components/cart/cart-loading-skeleton';
import type { CartItem } from '@/store/use-cart';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    loading,
    error,
    totalPrice,
    fetchCart,
    updateCartItem,
    removeCartItem,
    addToCart,
    removeFromCart
  } = useCart();
  const { isAuthenticated   } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const hasFetchedRef = useRef(false);

  // Handle hydration and fetch cart
  useEffect(() => {
    setIsHydrated(true);
    if (isAuthenticated && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleIncrease = (item: CartItem) => {
    if (isAuthenticated && item.apiData?.cartItemId) {
      // Use backend API for authenticated users
      updateCartItem(item.apiData.cartItemId, item.quantity + 1);
    } else {
      // Fallback to local cart for unauthenticated users
      addToCart({ ...item, quantity: item.quantity + 1 });
    }
  };

  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      if (isAuthenticated && item.apiData?.cartItemId) {
        // Use backend API for authenticated users
        updateCartItem(item.apiData.cartItemId, item.quantity - 1);
      } else {
        // Fallback to local cart for unauthenticated users
        console.log('=== HANDLE DECREASE CALLED (LOCAL) ===');
        addToCart({ ...item, quantity: item.quantity - 1 });
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?returnUrl=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="pb-8 lg:pb-12">
      <BannerSection
        title="SHOPPING CART"
        description="View all your products to be purchased here"
        bgImage="/images/bg2.svg"
        disableAnimation={!isHydrated}
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart' }
            ]}
          />
        }
      />

      <SectionContainer>
        {!isHydrated || loading ? (
          <CartLoadingSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error loading cart: {error}</p>
            <button
              onClick={() => fetchCart()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Cart Items Side */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-ethereal font-semibold">YOUR CART</h2>
                <div className="flex gap-2">
                  <div className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                    Items: {items.length}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {items.map((item, index) => {
                  return (
                    <CartItemCard
                      key={`${item.productId}-${index}`}
                      item={item}
                      onRemove={() => {
                        if (isAuthenticated && item.apiData?.cartItemId) {
                          removeCartItem(item.apiData.cartItemId);
                        } else {
                          removeFromCart(item.productId);
                        }
                      }}
                      onIncrease={() => handleIncrease(item)}
                      onDecrease={() => handleDecrease(item)}
                      onEdit={() => {
                        if (isAuthenticated) {
                          fetchCart(); // Refresh cart data after edit
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
            {/* Summary Side */}
            <div className="w-full lg:w-[400px] flex-shrink-0 lg:border-l lg:border-gray-200 lg:pl-8">
              <CartTotalsSection 
                onProceedToCheckout={handleProceedToCheckout} 
                backendTotal={isAuthenticated ? totalPrice : undefined}
              />
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
} 