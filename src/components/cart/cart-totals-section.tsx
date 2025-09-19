'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/use-cart';

interface CartTotalsSectionProps {
  onProceedToCheckout: () => void;
  backendTotal?: number; // Total from backend API
}

export function CartTotalsSection({ onProceedToCheckout, backendTotal }: CartTotalsSectionProps) {
  const { items } = useCart();

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  // Use backend total if available, otherwise calculate from items
  const subtotal = backendTotal ?? items.reduce((sum, item) => sum + (item.totalPrice), 0);
  const total = subtotal;

  return (
    <div className="space-y-6">
      {/* Cart Totals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">CART TOTALS</h2>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
        {/* Consultation Card */}

      </div>


      <div className="mt-6 space-y-3">
        <Button
          onClick={onProceedToCheckout}
          className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white font-semibold rounded-lg py-3 text-base transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Proceed to Checkout
        </Button>

        <div className="text-center">
          <Link
            href="/shop"
            className="text-gray-700 underline hover:text-gray-900 transition-colors text-sm"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>


    </div>
  );
} 