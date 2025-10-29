'use client';

import React from 'react';

export function CartLoadingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      {/* Cart Items Side */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl md:text-2xl font-ethereal font-semibold mb-6">YOUR CART</h2>
        <div className="space-y-6">
          {/* Cart Item Skeleton */}
          <div className="bg-white p-6 space-y-4">
            <div className="flex gap-6">
              {/* Image Skeleton */}
              <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
              
              {/* Content Skeleton */}
              <div className="flex-1 min-w-0 space-y-4">
                {/* Title and Close Button */}
                <div className="flex items-start justify-between">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Edit Button */}
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>

                {/* Customizations */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-40"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-36"></div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-44"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-38"></div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-52"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-28"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                      <div className="w-12 h-8 bg-gray-200 animate-pulse border-x border-gray-200"></div>
                      <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                </div>

                {/* Item Total */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Side */}
      <div className="w-full lg:w-[400px] flex-shrink-0 lg:border-l lg:border-gray-200 lg:pl-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">CART TOTALS</h3>
          
          {/* Summary Items */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-7 bg-gray-200 rounded animate-pulse w-28"></div>
          </div>

          {/* Checkout Button */}
          <div className="h-12 bg-[#C9A18A] rounded-lg animate-pulse"></div>

          {/* Continue Shopping */}
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated loading spinner component
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#C9A18A] rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
} 