'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/store/use-cart';

export function OrderSummary() {
  const { items, totalPrice } = useCart();
  
  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <p className="text-gray-500">No items in cart</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={`${item.productId}-${index}`} className="flex gap-3">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">IMG</span>
                  </div>
                )}
              </div>
              {item.quantity > 1 && (
                <div className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.title}
              </h4>
              
              {/* Show key customizations */}
              {Object.entries(item.customizations).length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {Object.entries(item.customizations).slice(0, 2).map(([type, option]) => (
                    <div key={type}>
                      {type}: {option.label}
                    </div>
                  ))}
                  {Object.entries(item.customizations).length > 2 && (
                    <div className="text-gray-400">
                      +{Object.entries(item.customizations).length - 2} more
                    </div>
                  )}
                </div>
              )}
              
              {/* Processing time if available */}
              {item.delivery?.['Processing Time'] && item.delivery['Processing Time'].label !== 'None' && (
                <div className="text-xs text-gray-500 mt-1">
                  Processing: {item.delivery['Processing Time'].label}
                </div>
              )}
              
              <div className="text-sm font-medium text-gray-900 mt-1">
                {formatPrice(item.totalPrice)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatPrice(totalPrice || 0)}</span>
        </div>
        

        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatPrice(totalPrice || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
