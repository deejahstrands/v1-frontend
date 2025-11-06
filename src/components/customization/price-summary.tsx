"use client";

import React from 'react';
import { useCustomization } from '@/store/use-customization';

interface PriceSummaryProps {
  className?: string;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ className }) => {
  const { selectedWigType, selectedOptions, getTotalPrice } = useCustomization();

  if (!selectedWigType) {
    return null;
  }

  const basePrice = selectedWigType.basePrice;
  const totalPrice = getTotalPrice();

  return (
    <div className={className}>
      <div className="bg-white rounded-xl p-6 border border-[#98A2B3] w-full max-w-md mx-auto">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#344054] mb-2">
            Price Summary
          </h3>
        </div>

        <div className="space-y-3">
          {/* Base Price */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              {selectedWigType.name} Wig
            </span>
            <span className="text-sm font-medium">
              ₦{basePrice.toLocaleString()}
            </span>
          </div>

          {/* Customization Options */}
          {Object.entries(selectedOptions).map(([type, option]) => {
            if (option.price && option.price > 0) {
              return (
                <div key={type} className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">
                    {type}: {option.label}
                  </span>
                  <span className="text-sm font-medium">
                    ₦{option.price.toLocaleString()}
                  </span>
                </div>
              );
            }
            return null;
          })}

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-semibold text-[#344054]">
              Total Price
            </span>
            <span className="text-xl font-bold text-secondary">
              ₦{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            * Prices include all customization options. Final price may vary based on additional services.
          </p>
        </div>
      </div>
    </div>
  );
}; 