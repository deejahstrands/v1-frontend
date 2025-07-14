'use client'

import { Banner } from '@/components/common/banner';
import { SectionContainer } from '@/components/common/section-container';
import React from 'react';
import { useCart } from '@/store/use-cart';
import CartItemCard from '@/components/common/cart/CartItemCard';
import type { CartItem } from '@/store/use-cart';

export default function CartPage() {
  const { items, removeFromCart, addToCart } = useCart();

  const handleIncrease = (item: CartItem) => {
    addToCart({ ...item, quantity: item.quantity + 1 });
  };

  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: item.quantity - 1 });
    }
  };

  return (
    <div>
      <Banner
        title="SHOPPING CART"
        description="View all your products to be purchased here"
        bgImage="/images/bg2.svg"
      />
      <SectionContainer>
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Cart Items Side */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-ethereal font-semibold mb-6">YOUR CART</h2>
            <div className="space-y-6">
              {items.length === 0 ? (
                <div className="text-gray-500">Your cart is empty.</div>
              ) : (
                items.map((item) => (
                  <CartItemCard
                    key={item.productId}
                    item={item}
                    onRemove={() => removeFromCart(item.productId)}
                    onIncrease={() => handleIncrease(item)}
                    onDecrease={() => handleDecrease(item)}
                  />
                ))
              )}
            </div>
          </div>
          {/* Summary Side */}
          <div className="w-full lg:w-[350px] flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              Cart summary panel goes here
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
} 