"use client";

import React from 'react';
import { WigType } from '@/data/customization';
import { useCustomization } from '@/store/use-customization';

interface WigTypeSelectorProps {
  wigTypes: WigType[];
  className?: string;
}

export const WigTypeSelector: React.FC<WigTypeSelectorProps> = ({ wigTypes, className }) => {
  const { selectedWigType, setSelectedWigType } = useCustomization();

  return (
    <div className={className}>
      <div className=" w-full max-w-md mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#344054] mb-2">
            Choose your Wig Type
          </h3>
          <p className="text-sm text-gray-600">
            Select the type of wig you want to customize
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {wigTypes.map((wigType) => {
            const isSelected = selectedWigType?.id === wigType.id;
            return (
              <button
                key={wigType.id}
                type="button"
                onClick={() => setSelectedWigType(wigType)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-[#C9A18A] hover:bg-[#b88b6d] text-white font-semibold'
                    : 'border-[#98A2B3] hover:border-secondary/50 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-xs mb-1">{wigType.name}</div>
                <div className="text-xs text-gray-600 font-semibold">
                  ₦{wigType.basePrice.toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 