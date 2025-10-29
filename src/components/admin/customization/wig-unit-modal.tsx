/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { X, Save, Plus, Edit } from 'lucide-react';

interface WigUnit {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  createdAt: string;
  updatedAt: string;
}

interface WigUnitModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  unit?: WigUnit;
  onSave: (data: {
    name: string;
    description?: string;
    basePrice: number;
  }) => Promise<void>;
}

export function WigUnitModal({
  open,
  onClose,
  mode,
  unit,
  onSave,
}: WigUnitModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or unit changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && unit) {
        setFormData({
          name: unit.name,
          description: unit.description || '',
          basePrice: unit.basePrice.toString(),
        });
      } else {
        setFormData({
          name: '',
          description: '',
          basePrice: '',
        });
      }
      setErrors({});
    }
  }, [open, mode, unit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

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
      newErrors.name = 'Unit name is required';
    }

    if (!formData.basePrice.trim()) {
      newErrors.basePrice = 'Base price is required';
    } else if (isNaN(Number(formData.basePrice)) || Number(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Base price must be a valid positive number';
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
      const dataToSave: any = {};
      
      // For edit mode, only include changed fields
      if (mode === 'edit' && unit) {
        if (formData.name.trim() !== unit.name) {
          dataToSave.name = formData.name.trim();
        }
        const currentDescription = formData.description.trim();
        const originalDescription = unit.description || '';
        if (currentDescription !== originalDescription) {
          // Only include description if it's not empty
          if (currentDescription) {
            dataToSave.description = currentDescription;
          }
        }
        if (Number(formData.basePrice) !== unit.basePrice) {
          dataToSave.basePrice = Number(formData.basePrice);
        }
      } else {
        // For add mode, send all fields
        dataToSave.name = formData.name.trim();
        const description = formData.description.trim();
        if (description) {
          dataToSave.description = description;
        }
        dataToSave.basePrice = Number(formData.basePrice);
      }

      await onSave(dataToSave);
    } catch (error) {
      // Error is handled by the parent component
      console.error('Error saving wig unit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="md"
      showCloseButton={false}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {mode === 'edit' ? (
                <Edit className="w-5 h-5 text-gray-600" />
              ) : (
                <Plus className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? 'Edit Wig Unit' : 'Add Wig Unit'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'edit' ? 'Update the wig unit details' : 'Create a new wig unit'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Unit Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Unit Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter unit name"
              error={errors.name}
              className="w-full"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
              className="w-full"
            />
          </div>

          {/* Base Price */}
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-2">
              Base Price *
            </label>
            <Input
              id="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={(e) => handleInputChange('basePrice', e.target.value)}
              placeholder="Enter base price"
              error={errors.basePrice}
              className="w-full"
            />
            {errors.basePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="tertiary"
              onClick={handleClose}
              className="flex-1 border"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              icon={<Save className="w-4 h-4" />}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Unit' : 'Add Unit'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
