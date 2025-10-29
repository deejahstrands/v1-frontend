'use client';

import React from 'react';
import { SectionContainer } from '@/components/common/section-container';

export function ShopLoadingSkeleton() {
  return (
    <SectionContainer>
      {/* Banner Skeleton */}
      <div className="pt-6 lg:pt-10">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[200px] md:min-h-[320px] bg-gray-200 animate-pulse"></div>
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-24"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-28"></div>
            <div className="ml-auto h-10 bg-gray-200 rounded-lg animate-pulse w-20"></div>
          </div>
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] w-full bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
} 