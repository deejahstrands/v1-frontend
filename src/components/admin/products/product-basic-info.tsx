"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';

interface ProductBasicInfoProps {
  formData: {
    name: string;
    basePrice: string;
    categoryId: string;
    description: string;
    thumbnail: File | string | null;
  };
  galleryImages: Array<{
    id: string;
    file?: File;
    url: string;
    isExisting?: boolean;
    type?: 'image' | 'video';
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
  errors: Record<string, string>;
  onInputChange: (field: string, value: string | number | boolean | File | null) => void;
  onGalleryChange: (images: Array<{
    id: string;
    file?: File;
    url: string;
    isExisting?: boolean;
    type?: 'image' | 'video';
  }>) => void;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  galleryImages,
  categories,
  errors,
  onInputChange,
  onGalleryChange
}) => {
  return (
    <div className="space-y-6">
      {/* Product Thumbnail */}
      <div>
        <ImageUpload
          label="Product Thumbnail"
          helperText="Upload a clear image of your product"
          acceptedTypes="PNG, JPG, GIF, & MP4"
          maxDimensions="800x400px"
          onFileSelect={(file) => onInputChange('thumbnail', file)}
          error={errors.thumbnail}
          existingImage={typeof formData.thumbnail === 'string' ? formData.thumbnail : undefined}
        />
      </div>

      {/* Product Name, Base Price, and Category in a row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Name */}
        <div>
          <Input
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            error={errors.name}
            required
          />
        </div>

        {/* Base Price */}
        <div>
          <Input
            label="Base Price"
            placeholder="Enter base price"
            value={formData.basePrice}
            onChange={(e) => onInputChange('basePrice', e.target.value)}
            error={errors.basePrice}
            required
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Category"
            placeholder="Select a category"
            value={formData.categoryId}
            onChange={(value) => onInputChange('categoryId', value)}
            error={errors.categoryId}
            required
            options={categories.map(category => ({
              value: category.id,
              label: category.name
            }))}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          rows={4}
          placeholder="Describe your product..."
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 ml-auto">
            {formData.description.length}/500 characters
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <GalleryUpload
          label="Product Gallery"
          helperText="Share a few snippets of this product"
          onImagesChange={onGalleryChange}
          existingImages={galleryImages.filter(img => img.isExisting).map(img => img.url)}
          error={errors.gallery}
        />
      </div>
    </div>
  );
};
