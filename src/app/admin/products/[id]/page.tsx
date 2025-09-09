/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Settings } from "lucide-react";
import { Button } from '@/components/common/button';
import { useProductManagement } from '@/hooks/admin/use-product-management';
import { useToast } from '@/hooks/use-toast';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import Image from 'next/image';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { getProduct, updateProduct, isSaving } = useProductManagement();
  
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadedProductId = useRef<string | null>(null);

  // Status modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: 'available' as 'available' | 'sold_out',
    visibility: 'published' as 'published' | 'hidden',
    featured: false,
  });

  const productId = params.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      // Prevent multiple simultaneous calls for the same product
      if (loadedProductId.current === productId || !productId) return;
      
      try {
        setIsLoading(true);
        loadedProductId.current = productId;
        const productData = await getProduct(productId);
        setProduct(productData);
        
        // Initialize status form with product data
        setStatusForm({
          status: productData.status,
          visibility: productData.visibility,
          featured: productData.featured || false,
        });
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = () => {
    router.push(`/admin/products?mode=edit&id=${productId}`);
  };

  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  const handleStatusFormChange = (field: string, value: string | boolean) => {
    setStatusForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateStatus = async () => {
    if (!product) return;

    try {
      await updateProduct(product.id, {
        status: statusForm.status,
        visibility: statusForm.visibility,
        featured: statusForm.featured,
      });
      
      // Update local product state
      setProduct((prev: any) => ({
        ...prev,
        status: statusForm.status,
        visibility: statusForm.visibility,
        featured: statusForm.featured,
      }));
      
      setIsStatusModalOpen(false);
      toast.success('Product status updated successfully!');
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => router.push('/admin/products/list')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl pb-10">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="tertiary"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push('/admin/products')}
        >
          Go Back
        </Button>
      </div>

      {product && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Product Header */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status === 'available' ? 'Available' : 'Sold Out'}
                </span>
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-medium">#{product.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    product.visibility === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.visibility === 'published' ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Added on:</span>
                  <span className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-bold text-lg">₦{product.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quantity:</span>
                  <span className="font-medium">{product.totalQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Available:</span>
                  <span className="font-medium text-green-600">{product.quantityAvailable}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sold:</span>
                  <span className="font-medium text-red-600">{product.quantitySold}</span>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  <Button
                    icon={<Edit className="w-4 h-4" />}
                    onClick={handleEdit}
                    className="w-full justify-start text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    icon={<Settings className="w-4 h-4" />}
                    variant="tertiary"
                    onClick={handleOpenStatusModal}
                    className="w-full justify-start"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customization, Gallery, etc. */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Specifications */}
            {product.productSpecifications && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(product.productSpecifications).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 capitalize">{key}</div>
                      <div className="font-semibold text-gray-900">{value as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.gallery.map((image: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} gallery ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Customization */}
            {product.customizations && product.customizations.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Customization</h2>
                <div className="space-y-4">
                  {product.customizations.map((customization: any, index: number) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-900 mb-2 capitalize">
                        {customization.typeName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {customization.options.map((option: any, optionIndex: number) => (
                          <div key={optionIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">{option.name}</span>
                            <span className="text-sm font-bold text-green-600">
                              +₦{option.price.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Private Fittings */}
            {product.privateFittings && product.privateFittings.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Private Fittings</h2>
                <div className="space-y-2">
                  {product.privateFittings.map((fitting: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{fitting.name}</span>
                      <span className="text-sm font-bold text-green-600">
                        +₦{fitting.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Times */}
            {product.processingTimes && product.processingTimes.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Times</h2>
                <div className="space-y-2">
                  {product.processingTimes.map((time: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{time.label}</span>
                      <span className="text-sm font-bold text-green-600">
                        +₦{time.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      <Modal
        open={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        size="md"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Update Product Status
          </h3>
          <p className="text-gray-600 mb-6">
            Update the status, visibility, and featured settings for &quot;{product?.name}&quot;
          </p>
          
          <div className="space-y-4">
            {/* Status */}
            <Select
              label="Product Status"
              value={statusForm.status}
              onChange={(value) => handleStatusFormChange('status', value)}
              options={[
                { label: 'Available', value: 'available' },
                { label: 'Sold Out', value: 'sold_out' }
              ]}
            />

            {/* Visibility */}
            <Select
              label="Visibility"
              value={statusForm.visibility}
              onChange={(value) => handleStatusFormChange('visibility', value)}
              options={[
                { label: 'Published', value: 'published' },
                { label: 'Hidden', value: 'hidden' }
              ]}
            />

            {/* Featured */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
              <button
                onClick={() => handleStatusFormChange('featured', !statusForm.featured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  statusForm.featured ? 'bg-black' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    statusForm.featured ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="tertiary"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateStatus}
              disabled={isSaving}
              className="!bg-black text-white"
            >
              {isSaving ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}