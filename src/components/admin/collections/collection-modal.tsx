"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchInput } from '@/components/ui/search-input';
import { Collection, CreateCollectionData, UpdateCollectionData } from '@/services/admin/collection.service';
import { AdminProduct } from '@/services/admin';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateCollectionData | UpdateCollectionData) => Promise<boolean>;
  mode: 'add' | 'edit';
  collection?: Collection;
  isLoading?: boolean;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  open,
  onClose,
  onSave,
  mode,
  collection,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    featured: false,
    thumbnail: '',
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableProducts, setAvailableProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (collection && mode === 'edit') {
      setFormData({
        name: collection.name,
        description: collection.description,
        status: collection.status,
        featured: collection.featured,
        thumbnail: collection.thumbnail,
      });
      // TODO: Load selected products for edit mode
      setSelectedProducts([]);
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        featured: false,
        thumbnail: '',
      });
      setSelectedProducts([]);
    }
  }, [collection, mode, open]);

  // Load available products
  useEffect(() => {
    if (open) {
      setIsLoadingProducts(true);
      // Simulate API call
      setTimeout(() => {
        // Mock products - replace with actual API call
        const mockProducts: AdminProduct[] = [
          {
            id: '1',
            name: 'HD Closure Wig - Burgundy',
            thumbnail: '/dummy/avatar.svg',
            basePrice: 2000000,
            category: { id: '1', name: 'Wigs' },
            status: 'available',
            visibility: 'published',
            customization: true,
            featured: false,
            createdAt: new Date().toISOString(),
            deletedAt: null,
            quantityAvailable: 10,
          },
          {
            id: '2',
            name: 'Swiss Lace Frontal - Black',
            thumbnail: '/dummy/avatar.svg',
            basePrice: 1500000,
            category: { id: '1', name: 'Wigs' },
            status: 'available',
            visibility: 'published',
            customization: false,
            featured: false,
            createdAt: new Date().toISOString(),
            deletedAt: null,
            quantityAvailable: 5,
          },
          {
            id: '3',
            name: 'Deep Wave Closure - Brown',
            thumbnail: '/dummy/avatar.svg',
            basePrice: 1800000,
            category: { id: '1', name: 'Wigs' },
            status: 'available',
            visibility: 'published',
            customization: true,
            featured: false,
            createdAt: new Date().toISOString(),
            deletedAt: null,
            quantityAvailable: 8,
          },
        ];
        setAvailableProducts(mockProducts);
        setIsLoadingProducts(false);
      }, 1000);
    }
  }, [open]);

  // Filter products based on search
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle product selection
  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Handle select all products
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // Handle remove product from selected
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a collection name');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    const submitData = {
      ...formData,
      products: selectedProducts,
    };

    const success = await onSave(submitData);
    if (success) {
      onClose();
    }
  };

  // Get selected products for display
  const selectedProductsList = availableProducts.filter(p => selectedProducts.includes(p.id));

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'add' ? 'Create New Collection' : 'Edit Collection'}
            </h2>
            <p className="text-gray-600 mt-1">
              {mode === 'add' 
                ? 'Create a new collection for your store' 
                : 'Update collection details and products'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="tertiary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="!bg-black text-white"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Collection Details */}
          <div className="space-y-6">
            {/* Collection Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Thumbnail
              </label>
              <p className="text-sm text-gray-500 mb-3">
                This will be displayed on the all product
              </p>
              <div className="flex gap-4">
                {formData.thumbnail && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={formData.thumbnail}
                      alt="Collection thumbnail"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, or JPG (max. 800x400px)
                  </p>
                </div>
              </div>
            </div>

            {/* Collection Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter collection name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Visibility Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility Status
              </label>
              <Select
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </div>

            {/* Feature Tag */}
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <label className="text-sm font-medium text-gray-700">
                Feature Tag
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <p className="text-sm text-gray-500 mb-2">Write a short introduction.</p>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter Description"
                rows={4}
                maxLength={275}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                No more than 275 Characters
              </p>
            </div>
          </div>

          {/* Right Column - Product Assignment */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assign Product</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select which product you want under this collection
              </p>

              {/* Search Products */}
              <div className="mb-4">
                <SearchInput
                  placeholder="Search Product"
                  value={searchTerm}
                  onChange={setSearchTerm}
                />
              </div>

              {/* Available Products */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Available Products</h4>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Select all
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  {isLoadingProducts ? (
                    <div className="p-4 text-center text-gray-500">Loading products...</div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="p-3 flex items-center space-x-3">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₦{product.basePrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No products found</div>
                  )}
                </div>
              </div>

              {/* Selected Products */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Selected Products</h4>
                <div className="border border-gray-200 rounded-lg min-h-32 p-4">
                  {selectedProductsList.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProductsList.map((product) => (
                        <div key={product.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">
                                ₦{product.basePrice.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm">No products selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="tertiary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="!bg-black text-white"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
