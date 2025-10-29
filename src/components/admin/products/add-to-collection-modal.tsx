"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Select } from '@/components/ui/select';
import { AdminProduct } from '@/services/admin';

interface AddToCollectionModalProps {
  open: boolean;
  onClose: () => void;
  product: AdminProduct | null;
  onAddToCollection: (productId: string, collectionId: string) => Promise<void>;
  isAdding?: boolean;
}

// Mock collections data - replace with actual API call
const mockCollections = [
  { id: 'collection-1', name: 'Summer Collection' },
  { id: 'collection-2', name: 'Winter Collection' },
  { id: 'collection-3', name: 'Spring Collection' },
  { id: 'collection-4', name: 'Featured Products' },
  { id: 'collection-5', name: 'New Arrivals' },
];

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  open,
  onClose,
  product,
  onAddToCollection,
  isAdding = false
}) => {
  const [selectedCollection, setSelectedCollection] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedCollection('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!product) return;

    if (!selectedCollection) {
      setError('Please select a collection');
      return;
    }

    try {
      await onAddToCollection(product.id, selectedCollection);
      onClose();
    } catch (error) {
      console.error('Error adding product to collection:', error);
      setError('Failed to add product to collection');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Add Product to Collection
        </h3>
        
        {product && (
          <div className="mb-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.category.name}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Select
            label="Select Collection"
            placeholder="Choose a collection"
            value={selectedCollection}
            onChange={setSelectedCollection}
            options={mockCollections.map(collection => ({
              label: collection.name,
              value: collection.id
            }))}
            error={error}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="tertiary"
            onClick={onClose}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isAdding || !selectedCollection}
            className="!bg-black text-white"
          >
            {isAdding ? 'Adding...' : 'Add to Collection'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
