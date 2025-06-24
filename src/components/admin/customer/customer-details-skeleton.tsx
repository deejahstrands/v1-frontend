"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { ChevronLeft } from "lucide-react";

export function CustomerDetailsSkeleton() {
  return (
    <div className="w-full mx-auto">
      {/* Breadcrumb Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm mb-6">
        <div className="text-gray-500 flex items-center gap-1 mb-2 sm:mb-0">
          <ChevronLeft className="w-4 h-4" />
          <Skeleton className="w-16 h-5" /> {/* Go Back */}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 hidden sm:inline">•</span>
          <Skeleton className="w-16 h-5" /> {/* Customer */}
          <span className="text-gray-400">/</span>
          <Skeleton className="w-32 h-5" /> {/* View Customer Details */}
        </div>
      </div>

      <Skeleton className="w-48 h-8 mb-8" /> {/* Page Title */}

      {/* Two-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info Card Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full mb-4" />
            <Skeleton className="w-32 h-6" />
          </div>

          <div className="space-y-4">
            {/* Info Fields */}
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-full h-5" />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Skeleton className="w-24 h-5 mb-2" />
            <Skeleton className="w-full h-9 rounded-lg" />
          </div>
        </div>

        {/* Tables Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders Table */}
          <div>
            <Skeleton className="w-32 h-7 mb-4" />
            <TableSkeleton columns={5} rows={3} />
          </div>

          {/* Wishlist Table */}
          <div>
            <Skeleton className="w-32 h-7 mb-4" />
            <TableSkeleton columns={4} rows={2} />
          </div>

          {/* Address Table */}
          <div>
            <Skeleton className="w-32 h-7 mb-4" />
            <TableSkeleton columns={3} rows={1} />
          </div>
        </div>
      </div>
    </div>
  );
} 