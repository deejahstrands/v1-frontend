'use client'

import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/store/use-cart';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { CartTotalsSection } from '@/components/cart/cart-totals-section';
import { EmptyCartState } from '@/components/cart/empty-cart-state';
import { CartLoadingSkeleton } from '@/components/cart/cart-loading-skeleton';
import type { CartItem } from '@/store/use-cart';

export default function CartPage() {
  const { items, removeFromCart, addToCart } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleIncrease = (item: CartItem) => {
    addToCart({ ...item, quantity: item.quantity + 1 });
  };

  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: item.quantity - 1 });
    }
  };

  const handleProceedToCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Proceeding to checkout...');
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
        {!isHydrated ? (
          <CartLoadingSkeleton />
        ) : items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Cart Items Side */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-ethereal font-semibold mb-6">YOUR CART</h2>
              <div className="space-y-6">
                {items.map((item) => (
                  <CartItemCard
                    key={item.productId}
                    item={item}
                    onRemove={() => removeFromCart(item.productId)}
                    onIncrease={() => handleIncrease(item)}
                    onDecrease={() => handleDecrease(item)}
                  />
                ))}
              </div>
            </div>
            {/* Summary Side */}
            <div className="w-full lg:w-[400px] flex-shrink-0 lg:border-l lg:border-gray-200 lg:pl-8">
              <CartTotalsSection onProceedToCheckout={handleProceedToCheckout} />
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
} 