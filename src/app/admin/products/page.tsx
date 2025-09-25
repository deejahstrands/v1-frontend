/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from "lucide-react";
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useProductManagement } from '@/hooks/admin/use-product-management';
import { useCollectionManagement } from '@/hooks/admin/use-collection-management';
import { useToast } from '@/hooks/use-toast';
import { ProductBasicInfo } from '@/components/admin/products/product-basic-info';
import { ProductStatusRow } from '@/components/admin/products/product-status-row';
import { ProductSpecifications } from '@/components/admin/products/product-specifications';
import { ProductCustomization } from '@/components/admin/products/product-customization';
import { ProductToggles } from '@/components/admin/products/product-toggles';
import { ProductDeliveryPreference } from '@/components/admin/products/product-delivery-preference';
import cloudinaryService from '@/services/cloudinary';

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
    const { toast } = useToast();

    const {
    categories,
    isSaving,
    createProduct,
    updateProduct,
    getProduct,
  } = useProductManagement();

  const {
    collections,
    isLoading: collectionsLoading,
    loadAllCollections,
  } = useCollectionManagement();

  // Get mode and product ID from URL
  const mode = searchParams.get('mode') as 'add' | 'edit' | null;
  const productId = searchParams.get('id');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    basePrice: 0,
    categoryId: '',
    description: '',
    thumbnail: undefined as File | string | undefined,
    status: 'available' as 'available' | 'sold_out',
    collectionId: '',
    visibility: 'published' as 'published' | 'hidden',
    customization: false,
    featured: false,
  });

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<Array<{ id: string; file?: File; url: string; isExisting?: boolean; type?: 'image' | 'video' }>>([]);

  // Product specifications state
  const [specifications, setSpecifications] = useState({
    length: '',
    density: '',
    color: '',
  });

  // Available options for specifications
  const lengthOptions = [
    '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30'
  ];
  const [densityOptions, setDensityOptions] = useState([
    '100', '150', '200', '250', '300', '350', '400', '450', '500'
  ]);
  const [colorOptions, setColorOptions] = useState([
    'Black', 'Burgundy', 'Blonde', 'Ginger', 'Hightlight'
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const loadedProductId = useRef<string | null>(null);

  // Modal state for adding new values
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'density' | 'color'>('density');
  const [addModalValue, setAddModalValue] = useState('');

  // Customization states
  const [selectedCustomizationTypes, setSelectedCustomizationTypes] = useState<string[]>([]);
  const [selectedCustomizationOptions, setSelectedCustomizationOptions] = useState<Array<{
    optionId: string;
    typeId: string;
    price: string;
  }>>([]);
  const [openCustomizationTypeId, setOpenCustomizationTypeId] = useState<string | null>(null);

  // Delivery preference states
  const [selectedFittings, setSelectedFittings] = useState<string[]>([]);
  const [selectedProcessingTimes, setSelectedProcessingTimes] = useState<string[]>([]);
  const [fittingPrices, setFittingPrices] = useState<Record<string, string>>({});
  const [processingTimePrices, setProcessingTimePrices] = useState<Record<string, string>>({});

  // Load all collections for dropdown
  useEffect(() => {
    loadAllCollections({ status: 'active' }); // Only load active collections for dropdown
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load product data for editing
  useEffect(() => {
    if (mode === 'edit' && productId && !isLoading && loadedProductId.current !== productId) {
      loadProductData(productId);
    }
  }, [mode, productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProductData = async (id: string) => {
    try {
      setIsLoading(true);
      loadedProductId.current = id;
      const product = await getProduct(id);
      
      // Cast product to any to access all properties
      const productData = product as any;
      
      // Set basic form data
      setFormData({
        name: product.name,
        basePrice: product.basePrice,
        categoryId: product.category.id,
        description: productData.description || '',
        thumbnail: product.thumbnail,
        status: product.status,
        collectionId: productData.collections?.[0] || '',
        visibility: product.visibility,
        customization: productData.customizations && productData.customizations.length > 0,
        featured: product.featured || false,
      });

      // Set product specifications
      if (productData.productSpecifications) {
        setSpecifications({
          length: productData.productSpecifications.length || '',
          density: productData.productSpecifications.density || '',
          color: productData.productSpecifications.color || '',
        });
      }

      // Set gallery images
      if (productData.gallery && productData.gallery.length > 0) {
        const galleryData = productData.gallery.map((item: any, index: number) => ({
          id: `existing-${index}`,
          url: typeof item === 'string' ? item : item.url,
          isExisting: true,
          type: typeof item === 'string' ? 'image' : item.type || 'image'
        }));
        setGalleryImages(galleryData);
      } else {
        setGalleryImages([]);
      }

      // Set customizations
      if (productData.customizations && productData.customizations.length > 0) {
        const typeIds = productData.customizations.map((custom: any) => custom.typeId);
        setSelectedCustomizationTypes(typeIds);

        const options: Array<{ optionId: string; typeId: string; price: string }> = [];
        productData.customizations.forEach((custom: any) => {
          if (custom.options && custom.options.length > 0) {
            custom.options.forEach((option: any) => {
              options.push({
                optionId: option.customizationId,
                typeId: custom.typeId,
                price: option.price.toString()
              });
            });
          }
        });
        setSelectedCustomizationOptions(options);
      } else {
        setSelectedCustomizationTypes([]);
        setSelectedCustomizationOptions([]);
      }

      // Set private fittings
      if (productData.privateFittings && productData.privateFittings.length > 0) {
        const fittingIds = productData.privateFittings.map((fitting: any) => fitting.fittingOptionId);
        setSelectedFittings(fittingIds);

        const fittingPriceMap: Record<string, string> = {};
        productData.privateFittings.forEach((fitting: any) => {
          fittingPriceMap[fitting.fittingOptionId] = fitting.price.toString();
        });
        setFittingPrices(fittingPriceMap);
      } else {
        setSelectedFittings([]);
        setFittingPrices({});
      }

      // Set processing times
      if (productData.processingTimes && productData.processingTimes.length > 0) {
        const timeIds = productData.processingTimes.map((time: any) => time.processingTimeId);
        setSelectedProcessingTimes(timeIds);

        const timePriceMap: Record<string, string> = {};
        productData.processingTimes.forEach((time: any) => {
          timePriceMap[time.processingTimeId] = time.price.toString();
        });
        setProcessingTimePrices(timePriceMap);
      } else {
        setSelectedProcessingTimes([]);
        setProcessingTimePrices({});
      }

    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear customization data when customization is turned off
    if (field === 'customization' && value === false) {
      setSelectedCustomizationTypes([]);
      setSelectedCustomizationOptions([]);
      setOpenCustomizationTypeId(null);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    setIsUploading(true);
    try {
      // Upload images to Cloudinary first
      let thumbnailUrl = '';

      // Upload thumbnail if it's a File
      if (formData.thumbnail && typeof formData.thumbnail !== 'string') {
        try {
          const thumbnailResult = await cloudinaryService.uploadImage(formData.thumbnail, 'products');
          thumbnailUrl = thumbnailResult.secure_url;
        } catch (error) {
          console.error('Thumbnail upload failed:', error);
          toast.error('Failed to upload thumbnail image');
          return;
        }
      } else if (typeof formData.thumbnail === 'string') {
        thumbnailUrl = formData.thumbnail;
      }

      // Upload gallery files (images and videos) in parallel
      const galleryFiles = galleryImages.filter(img => img.file).map(img => img.file!);
      const galleryData: Array<{ url: string; type: 'image' | 'video' }> = [];
      
      if (galleryFiles.length > 0) {
        try {
          const uploadPromises = galleryFiles.map(async (file) => {
            const imageIndex = galleryImages.findIndex(img => img.file === file);
            const imageType = galleryImages[imageIndex]?.type || (file.type.startsWith('video/') ? 'video' : 'image');
            
            if (imageType === 'video') {
              const result = await cloudinaryService.uploadVideo(file, 'products/gallery');
              return { url: result.secure_url, type: imageType as 'video' };
            } else {
              const result = await cloudinaryService.uploadImage(file, 'products/gallery');
              return { url: result.secure_url, type: imageType as 'image' };
            }
          });
          
          const uploadResults = await Promise.all(uploadPromises);
          galleryData.push(...uploadResults);
        } catch (error) {
          console.error('Gallery file upload failed:', error);
          toast.error('Failed to upload gallery files');
          return;
        }
      }

      // Add existing gallery data
      const existingGalleryData = galleryImages
        .filter(img => img.isExisting && img.url)
        .map(img => ({
          url: img.url,
          type: img.type || 'image'
        }));
      galleryData.push(...existingGalleryData);

      // Prepare data for API
      const productData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice.toString()) || 0, // Convert to number
        thumbnail: thumbnailUrl,
        quantityAvailable: 0, // Default value since we removed the field
        gallery: galleryData,
        specifications: {
          length: specifications.length,
          density: specifications.density,
          color: specifications.color,
        },
      };

      // Add customization data if enabled
      const customizationData = formData.customization ? {
        types: selectedCustomizationTypes,
        options: selectedCustomizationOptions.map(opt => ({
          optionId: opt.optionId,
          typeId: opt.typeId,
          price: opt.price,
          numericPrice: parseInt(opt.price.replace(/,/g, '')) || 0
        }))
      } : null;

      // Add delivery preference data
      const deliveryPreferenceData = {
        fittings: selectedFittings.map(fittingId => ({
          id: fittingId,
          price: parseInt(fittingPrices[fittingId]?.replace(/,/g, '') || '0')
        })),
        processingTimes: selectedProcessingTimes.map(timeId => ({
          id: timeId,
          price: parseInt(processingTimePrices[timeId]?.replace(/,/g, '') || '0')
        }))
      };

      if (mode === 'add') {
        await createProduct({
          ...productData,
          customizationData,
          deliveryPreferenceData
        } as Parameters<typeof createProduct>[0]);
        toast.success('Product created successfully!');
      } else if (mode === 'edit' && productId) {
        await updateProduct(productId, {
          ...productData,
          customizationData,
          deliveryPreferenceData
        } as Parameters<typeof updateProduct>[1]);
        toast.success('Product updated successfully!');
      }

      // Use setTimeout to avoid setState during render warning
      setTimeout(() => {
        router.push('/admin/products');
      }, 0);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  const handleAddValue = (type: 'density' | 'color') => {
    setAddModalType(type);
    setAddModalValue('');
    setIsAddModalOpen(true);
  };

  const handleConfirmAdd = () => {
    if (!addModalValue.trim()) return;

    if (addModalType === 'density') {
      if (!densityOptions.includes(addModalValue)) {
        setDensityOptions(prev => [...prev, addModalValue].sort((a, b) => parseInt(a) - parseInt(b)));
      }
    } else if (addModalType === 'color') {
      if (!colorOptions.includes(addModalValue)) {
        setColorOptions(prev => [...prev, addModalValue]);
      }
    }

    setIsAddModalOpen(false);
    setAddModalValue('');
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    setAddModalValue('');
  };

  // Customization handlers
  const handleCustomizationTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomizationTypes(prev => [...prev, typeId]);
      // Clear options for this type if it was previously selected
      setSelectedCustomizationOptions(prev => prev.filter(opt => opt.typeId !== typeId));
      // Open this type (accordion behavior)
      setOpenCustomizationTypeId(typeId);
    } else {
      setSelectedCustomizationTypes(prev => prev.filter(id => id !== typeId));
      // Clear options for this type
      setSelectedCustomizationOptions(prev => prev.filter(opt => opt.typeId !== typeId));
      // Close this type if it was open
      if (openCustomizationTypeId === typeId) {
        setOpenCustomizationTypeId(null);
      }
    }
  };

  const toggleCustomizationTypeAccordion = (typeId: string) => {
    if (openCustomizationTypeId === typeId) {
      setOpenCustomizationTypeId(null);
    } else {
      setOpenCustomizationTypeId(typeId);
    }
  };

  const handleCustomizationOptionChange = (optionId: string, typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomizationOptions(prev => [...prev, { optionId, typeId, price: '' }]);
    } else {
      setSelectedCustomizationOptions(prev => prev.filter(opt => opt.optionId !== optionId));
    }
  };

  const handleCustomizationPriceChange = (optionId: string, price: string) => {
    setSelectedCustomizationOptions(prev => 
      prev.map(opt => 
        opt.optionId === optionId ? { ...opt, price } : opt
      )
    );
  };

  // Delivery preference handlers
  const handleFittingChange = (fittingId: string, checked: boolean) => {
    if (checked) {
      setSelectedFittings(prev => [...prev, fittingId]);
            } else {
      setSelectedFittings(prev => prev.filter(id => id !== fittingId));
      // Remove price when unselected
      setFittingPrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[fittingId];
        return newPrices;
      });
    }
  };

  const handleProcessingTimeChange = (timeId: string, checked: boolean) => {
    if (checked) {
      setSelectedProcessingTimes(prev => [...prev, timeId]);
    } else {
      setSelectedProcessingTimes(prev => prev.filter(id => id !== timeId));
      // Remove price when unselected
      setProcessingTimePrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[timeId];
        return newPrices;
      });
    }
  };

  const handleFittingPriceChange = (fittingId: string, price: string) => {
    setFittingPrices(prev => ({
      ...prev,
      [fittingId]: price
    }));
  };

  const handleProcessingTimePriceChange = (timeId: string, price: string) => {
    setProcessingTimePrices(prev => ({
      ...prev,
      [timeId]: price
    }));
  };

  // If no mode specified, redirect to products list
  if (!mode) {
    router.push('/admin/products/list');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }


    return (
    <div className="w-full mx-auto max-w-4xl pb-10">
      {/* Header */}
            <div className="mb-6">
        {/* Go Back Button - Separate Row */}
        <div className="mb-4">
          <Button
            variant="tertiary"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleCancel}
          >
            Go Back
          </Button>
        </div>

        {/* Title and Action Buttons Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
            <h1 className="text-2xl font-semibold mb-1">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h1>
            <p className="text-gray-500">
              {mode === 'add' ? 'Create a new product for your store' : 'Update product information'}
            </p>
                    </div>

          {/* Top Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Button
              type="button"
              variant="tertiary"
              onClick={handleCancel}
              disabled={isSaving || isUploading}
                            className="w-full sm:w-auto"
                        >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSaving || isUploading}
              className="!bg-black text-white w-full sm:w-auto"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSubmit}
            >
              {isUploading ? 'Uploading...' : isSaving ? 'Saving...' : mode === 'add' ? 'Add Product' : 'Update Product'}
                        </Button>
                    </div>
                </div>
            </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Basic Product Information */}
        <ProductBasicInfo
          formData={{
            name: formData.name,
            basePrice: typeof formData.basePrice === 'number' ? formData.basePrice.toString() : formData.basePrice,
            categoryId: formData.categoryId,
            description: formData.description,
            thumbnail: formData.thumbnail as File | null,
          }}
          galleryImages={galleryImages}
          categories={categories}
          errors={errors}
          onInputChange={handleInputChange}
          onGalleryChange={setGalleryImages}
        />

        {/* Status Row */}
        <ProductStatusRow
          formData={{
            status: formData.status,
            collectionId: formData.collectionId,
            visibility: formData.visibility,
          }}
          collections={collections.map(collection => ({
            id: collection.id,
            name: collection.name
          }))}
          collectionsLoading={collectionsLoading}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {/* Product Specifications */}
        <ProductSpecifications
          specifications={specifications}
          lengthOptions={lengthOptions}
          densityOptions={densityOptions}
          colorOptions={colorOptions}
          errors={errors}
          onSpecificationChange={(field, value) => setSpecifications(prev => ({ ...prev, [field]: value }))}
          onAddDensity={() => handleAddValue('density')}
          onAddColor={() => handleAddValue('color')}
        />

        {/* Delivery Preference */}
        <ProductDeliveryPreference
          selectedFittings={selectedFittings}
          selectedProcessingTimes={selectedProcessingTimes}
          fittingPrices={fittingPrices}
          processingTimePrices={processingTimePrices}
          onFittingChange={handleFittingChange}
          onProcessingTimeChange={handleProcessingTimeChange}
          onFittingPriceChange={handleFittingPriceChange}
          onProcessingTimePriceChange={handleProcessingTimePriceChange}
        />

        {/* Featured Product Toggle */}
        <ProductToggles
          formData={{
            featured: formData.featured,
            customization: formData.customization,
          }}
          onInputChange={handleInputChange}
        />

        {/* Product Customization */}
        <ProductCustomization
          customizationEnabled={formData.customization}
          selectedTypes={selectedCustomizationTypes}
          selectedOptions={selectedCustomizationOptions}
          openTypeId={openCustomizationTypeId}
          onToggleCustomization={(checked) => handleInputChange('customization', checked)}
          onTypeChange={handleCustomizationTypeChange}
          onToggleTypeAccordion={toggleCustomizationTypeAccordion}
          onOptionChange={handleCustomizationOptionChange}
          onPriceChange={handleCustomizationPriceChange}
        />

        {/* Bottom Form Actions - Secondary */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                            <Button
            type="button"
            variant="tertiary"
            onClick={handleCancel}
            disabled={isSaving || isUploading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
                            </Button>
                                <Button
            type="button"
            disabled={isSaving || isUploading}
            className="!bg-black text-white w-full sm:w-auto order-1 sm:order-2"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            {isUploading ? 'Uploading...' : isSaving ? 'Saving...' : mode === 'add' ? 'Add Product' : 'Update Product'}
                                </Button>
                    </div>
                    </div>

      {/* Add Value Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={handleCancelAdd}
        size="sm"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Add New {addModalType === 'density' ? 'Density' : 'Color'}
          </h3>
          <div className="mb-6">
            <Input
              label={`Enter new ${addModalType} value:`}
              value={addModalValue}
              onChange={(e) => setAddModalValue(e.target.value)}
              placeholder={`Enter ${addModalType} value`}
              autoFocus
                            />
                        </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="tertiary"
              onClick={handleCancelAdd}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAdd}
              disabled={!addModalValue.trim()}
              className="!bg-black text-white"
            >
              Add
            </Button>
                </div>
        </div>
      </Modal>
        </div>
    );
}