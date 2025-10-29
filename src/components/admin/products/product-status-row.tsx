"use client";

import React from 'react';
import { Select } from '@/components/ui/select';

interface ProductStatusRowProps {
  formData: {
    status: string;
    collectionId: string;
    visibility: string;
  };
  collections: Array<{
    id: string;
    name: string;
  }>;
  collectionsLoading?: boolean;
  errors: Record<string, string>;
  onInputChange: (field: string, value: string | number | boolean | File | null) => void;
}

export const ProductStatusRow: React.FC<ProductStatusRowProps> = ({
  formData,
  collections,
  collectionsLoading = false,
  errors,
  onInputChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Status */}
      <div>
        <Select
          label="Status"
          placeholder="Select status"
          value={formData.status}
          onChange={(value) => onInputChange('status', value)}
          error={errors.status}
          required
          options={[
            { value: 'available', label: 'Available' },
            { value: 'sold_out', label: 'Sold Out' }
          ]}
        />
      </div>

      {/* Collection */}
      <div>
        <Select
          label="Collection (Optional)"
          placeholder={collectionsLoading ? "Loading collections..." : collections.length === 0 ? "No collections available" : "Select collection"}
          value={formData.collectionId}
          onChange={(value) => onInputChange('collectionId', value)}
          error={errors.collectionId}
          disabled={collectionsLoading}
          options={[
            { value: '', label: 'No Collection' },
            ...collections.map(collection => ({
              value: collection.id,
              label: collection.name
            }))
          ]}
        />
      </div>

      {/* Visibility */}
      <div>
        <Select
          label="Visibility"
          placeholder="Select visibility"
          value={formData.visibility}
          onChange={(value) => onInputChange('visibility', value)}
          error={errors.visibility}
          required
          options={[
            { value: 'published', label: 'Published' },
            { value: 'hidden', label: 'Hidden' }
          ]}
        />
      </div>
    </div>
  );
};
