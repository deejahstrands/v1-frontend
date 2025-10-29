"use client";

import React from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/common/button';
import { Plus } from 'lucide-react';

interface ProductSpecificationsProps {
  specifications: {
    length: string;
    density: string;
    color: string;
  };
  lengthOptions: string[];
  densityOptions: string[];
  colorOptions: string[];
  errors: Record<string, string>;
  onSpecificationChange: (field: string, value: string) => void;
  onAddDensity: () => void;
  onAddColor: () => void;
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  specifications,
  lengthOptions,
  densityOptions,
  colorOptions,
  errors,
  onSpecificationChange,
  onAddDensity,
  onAddColor
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Product Specifications</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Length */}
        <div>
          <Select
            label="Length"
            placeholder="Select length"
            value={specifications.length}
            onChange={(value) => onSpecificationChange('length', value)}
            error={errors.length}
            options={lengthOptions.map(length => ({
              value: length,
              label: `${length} inches`
            }))}
          />
        </div>

        {/* Density */}
        <div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                label="Density"
                placeholder="Select density"
                value={specifications.density}
                onChange={(value) => onSpecificationChange('density', value)}
                error={errors.density}
                options={densityOptions.map(density => ({
                  value: density,
                  label: density
                }))}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="tertiary"
                onClick={onAddDensity}
                className="px-3 py-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                label="Color"
                placeholder="Select color"
                value={specifications.color}
                onChange={(value) => onSpecificationChange('color', value)}
                error={errors.color}
                options={colorOptions.map(color => ({
                  value: color,
                  label: color
                }))}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="tertiary"
                onClick={onAddColor}
                className="px-3 py-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
