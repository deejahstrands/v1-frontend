"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { X, Save, Plus, Edit } from 'lucide-react';
import { AdminCategory, CreateCategoryData } from '@/services/admin';
import cloudinaryService from '@/services/cloudinary';
import { extractPublicIdFromUrl, isCloudinaryUrl } from '@/lib/cloudinary-utils';
import { useToast } from '@/hooks/use-toast';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  category?: AdminCategory;
  onSave: (category: AdminCategory) => Promise<void>;
}

const initialFormData: CreateCategoryData = {
  name: '',
  coverImage: '',
  description: '',
  status: 'active' as 'active' | 'inactive',
};

export function CategoryModal({ 
  open, 
  onClose, 
  mode, 
  category, 
  onSave 
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryData>(initialFormData);
  const [originalFormData, setOriginalFormData] = useState<CreateCategoryData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && category) {
        const categoryData = {
          name: category.name,
          coverImage: category.coverImage,
          description: category.description,
          status: category.status,
        };
        setFormData(categoryData);
        setOriginalFormData(categoryData);
        setImagePreview(category.coverImage);
        setSelectedImage(null);
      } else {
        setFormData(initialFormData);
        setOriginalFormData(initialFormData);
        setImagePreview('');
        setSelectedImage(null);
      }
      setErrors({});
    }
  }, [open, mode, category]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!imagePreview && !selectedImage) {
      newErrors.coverImage = 'Category image is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      let finalImageUrl = imagePreview;
      let oldImagePublicId: string | null = null;
      
      // If updating image and we have an existing Cloudinary image, get its public ID
      if (mode === 'edit' && selectedImage && category?.coverImage && isCloudinaryUrl(category.coverImage)) {
        oldImagePublicId = extractPublicIdFromUrl(category.coverImage);
      }
      
      // Upload new image to Cloudinary if selected
      if (selectedImage) {
        try {
          const uploadResult = await cloudinaryService.uploadImage(selectedImage, 'categories');
          finalImageUrl = uploadResult.secure_url;
          
          // Only delete old image after successful upload and if we have a valid public ID
          if (oldImagePublicId && oldImagePublicId.trim()) {
            try {
              console.log('Deleting old Cloudinary image:', oldImagePublicId);
              const deleteResponse = await fetch('/api/cloudinary/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicId: oldImagePublicId }),
              });
              
              if (!deleteResponse.ok) {
                const deleteError = await deleteResponse.json();
                console.warn('Failed to delete old image:', deleteError);
                // Don't fail the entire operation if deletion fails
              } else {
                console.log('Successfully deleted old Cloudinary image');
              }
            } catch (deleteError) {
              console.warn('Failed to delete old image, but continuing with save:', deleteError);
              // Don't fail the entire operation if deletion fails
            }
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }
      
      const categoryData = {
        ...formData,
        coverImage: finalImageUrl
      };
      
      // For edit mode, only send changed fields
      if (mode === 'edit') {
        const changedFields = getChangedFields();
        // Update the formData with the final image URL if image was changed
        if (changedFields.coverImage !== undefined) {
          changedFields.coverImage = finalImageUrl;
        }
        
        // Call the onSave callback with only the changed fields
        const mockCategory: AdminCategory = {
          id: category!.id,
          ...categoryData,
          createdAt: category!.createdAt,
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          noOfProducts: category!.noOfProducts,
        };
        
        try {
          await onSave(mockCategory);
          // Show success toast
          toast.success('Category updated successfully!');
          // Close modal after successful save
          onClose();
        } catch (error) {
          console.error('Error saving category:', error);
          // Show error toast
          toast.error('Failed to save category. Please try again.');
          // Don't close modal on error
        }
      } else {
        // For add mode, send all data
        const mockCategory: AdminCategory = {
          id: 'temp-id',
          ...categoryData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          noOfProducts: 0, // Default value for new categories
        };
        
        try {
          await onSave(mockCategory);
          // Show success toast
          toast.success('Category created successfully!');
          // Close modal after successful save
          onClose();
        } catch (error) {
          console.error('Error saving category:', error);
          // Show error toast
          toast.error('Failed to save category. Please try again.');
          // Don't close modal on error
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      // You might want to show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateCategoryData, value: string) => {
    setFormData((prev: CreateCategoryData) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field as string]: '' }));
    }
  };

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setSelectedImage(file);
      // Clear error
      if (errors.coverImage) {
        setErrors((prev: Record<string, string>) => ({ ...prev, coverImage: '' }));
      }
    } else {
      // File was removed
      setSelectedImage(null);
      // Don't clear imagePreview here - let the ImageUpload component handle it
      // The existing image should still be shown if no new file is selected
    }
  };

  // Function to get only the changed fields for PATCH requests
  const getChangedFields = (): Partial<CreateCategoryData> => {
    if (mode === 'add') {
      return formData;
    }
    
    const changes: Partial<CreateCategoryData> = {};
    
    if (formData.name !== originalFormData.name) {
      changes.name = formData.name;
    }
    
    if (formData.description !== originalFormData.description) {
      changes.description = formData.description;
    }
    
    if (formData.status !== originalFormData.status) {
      changes.status = formData.status;
    }
    
    // Check if image was changed (either new file selected or existing image removed)
    if (selectedImage || (originalFormData.coverImage && !imagePreview)) {
      changes.coverImage = imagePreview || '';
    }
    
    return changes;
  };

  const isFormValid = formData.name.trim() && (imagePreview || selectedImage) && formData.description.trim();

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      size="lg"
      showCloseButton={false}
    >
      <div className="h-full flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              {mode === 'add' ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'add' ? 'Create a new product category' : 'Edit Category'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'add' 
                  ? 'Add a new category to organize your products' 
                  : 'Update category information'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter category name"
                className={errors.name ? 'border-red-300 focus:border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Category Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image *
              </label>
              
              {/* File Upload - ImageUpload component handles its own preview */}
              <div className="mb-3">
                <ImageUpload
                  label="Upload an image file"
                  helperText="PNG, JPG (max. 800x400px, 2MB)"
                  onFileSelect={handleImageSelect}
                  className={errors.coverImage ? 'border-red-300' : ''}
                  existingImage={mode === 'edit' ? imagePreview : undefined}
                />
              </div>
              
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter category description"
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" }
                ]}
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                className="w-full"
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Actions */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="tertiary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              icon={<Save className="w-4 h-4" />}
              disabled={!isFormValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Category' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}