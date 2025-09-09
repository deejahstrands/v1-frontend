/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { ProductForm } from './product-form';
import { ProductFormData, CategoryOption } from '@/hooks/admin/use-product-management';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  product?: any; // AdminProduct type
  categories: CategoryOption[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  mode,
  product,
  categories,
  onSubmit,
  isLoading = false
}) => {
  // Convert AdminProduct to ProductFormData for editing
  const getInitialData = (): Partial<ProductFormData> | undefined => {
    if (mode === 'edit' && product) {
      return {
        name: product.name,
        basePrice: product.basePrice,
        categoryId: product.category.id,
        description: product.description || '',
        thumbnail: product.thumbnail,
        status: product.status,
        quantityAvailable: product.quantityAvailable,
        visibility: product.visibility,
        customization: product.customization,
        featured: product.featured || false,
      };
    }
    return undefined;
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error in product modal submit:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <ProductForm
        initialData={getInitialData()}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
        mode={mode}
      />
    </Modal>
  );
};
