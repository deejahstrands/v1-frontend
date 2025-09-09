"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Button } from '@/components/common/button';
import { ProductFormData, CategoryOption } from '@/hooks/admin/use-product-management';

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories: CategoryOption[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'add' | 'edit';
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  mode
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    basePrice: 0,
    categoryId: '',
    description: '',
    thumbnail: undefined,
    status: 'available',
    quantityAvailable: 0,
    visibility: 'published',
    customization: false,
    featured: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Handle thumbnail - if it's a string (URL), keep it, otherwise it's a File
        thumbnail: initialData.thumbnail || undefined,
      }));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean | File | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length > 275) {
      newErrors.description = 'Description must be 275 characters or less';
    }

    if (formData.quantityAvailable < 0) {
      newErrors.quantityAvailable = 'Quantity must be 0 or greater';
    }

    if (!formData.thumbnail && mode === 'add') {
      newErrors.thumbnail = 'Product thumbnail is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'sold_out', label: 'Sold Out' }
  ];

  const visibilityOptions = [
    { value: 'published', label: 'Published' },
    { value: 'hidden', label: 'Hidden' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Thumbnail */}
      <div>
        <ImageUpload
          label="Product Thumbnail"
          helperText="This will be displayed on the all product"
          acceptedTypes="PNG, JPG"
          maxDimensions="800x400px"
          onFileSelect={(file) => {
            if (file) {
              handleInputChange('thumbnail', file);
            }
          }}
          error={errors.thumbnail}
          existingImage={typeof formData.thumbnail === 'string' ? formData.thumbnail : undefined}
        />
      </div>

      {/* Product Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Name */}
        <div>
          <Input
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
          />
        </div>

        {/* Base Price */}
        <div>
          <Input
            label="Base price (₦)"
            type="number"
            placeholder="Enter price"
            value={formData.basePrice}
            onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
            error={errors.basePrice}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Category"
            placeholder="Select category"
            value={formData.categoryId}
            onChange={(value) => handleInputChange('categoryId', value)}
            options={categoryOptions}
            error={errors.categoryId}
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-[#162844]">
            Description
          </label>
          <p className="text-xs text-gray-500">Write a short introduction.</p>
        </div>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Enter Description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          maxLength={275}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <span className="text-sm text-red-600">{errors.description}</span>
          )}
          <span className="text-sm text-gray-500 ml-auto">
            {formData.description.length}/275 Characters
          </span>
        </div>
      </div>

      {/* Additional Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quantity Available */}
        <div>
          <Input
            label="Quantity Available"
            type="number"
            placeholder="Enter quantity"
            value={formData.quantityAvailable}
            onChange={(e) => handleInputChange('quantityAvailable', parseInt(e.target.value) || 0)}
            error={errors.quantityAvailable}
            min="0"
          />
        </div>

        {/* Status */}
        <div>
          <Select
            label="Status"
            placeholder="Select status"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value as 'available' | 'sold_out')}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Visibility and Options Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visibility */}
        <div>
          <Select
            label="Visibility"
            placeholder="Select visibility"
            value={formData.visibility}
            onChange={(value) => handleInputChange('visibility', value as 'hidden' | 'published')}
            options={visibilityOptions}
          />
        </div>

        {/* Customization */}
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="customization"
            checked={formData.customization}
            onChange={(e) => handleInputChange('customization', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="customization" className="text-sm font-medium text-[#162844]">
            Allow customization
          </label>
        </div>
      </div>

      {/* Featured Product */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => handleInputChange('featured', e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-[#162844]">
          Featured product
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="tertiary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="!bg-black text-white"
        >
          {isLoading ? 'Saving...' : mode === 'add' ? 'Add Product' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
};
