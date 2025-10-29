"use client";

import React from 'react';
import { Toggle } from '@/components/ui/toggle';

interface ProductTogglesProps {
  formData: {
    featured: boolean;
    customization: boolean;
  };
  onInputChange: (field: string, value: string | number | boolean | File | null) => void;
}

export const ProductToggles: React.FC<ProductTogglesProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      {/* Featured Product */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Featured Product</h3>
            <p className="text-xs text-gray-500 mt-1">Mark this product as featured</p>
          </div>
          <Toggle
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => onInputChange('featured', checked)}
          />
        </div>
      </div>
    </div>
  );
};
