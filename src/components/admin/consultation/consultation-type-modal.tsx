"use client";

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PriceInput } from '@/components/ui/price-input';
import { ConsultationType, CreateConsultationTypeData, UpdateConsultationTypeData } from '@/services/admin/consultation-type.service';

interface ConsultationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateConsultationTypeData | UpdateConsultationTypeData) => Promise<void>;
  mode: 'add' | 'edit';
  consultationType?: ConsultationType | null;
  isLoading?: boolean;
}

export function ConsultationTypeModal({
  isOpen,
  onClose,
  onSave,
  mode,
  consultationType,
  isLoading = false,
}: ConsultationTypeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or consultation type changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && consultationType) {
        setFormData({
          name: consultationType.name,
          price: consultationType.price,
          status: consultationType.status,
        });
      } else {
        setFormData({
          name: '',
          price: '',
          status: 'active',
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, consultationType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Consultation type name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceValue = parseInt(formData.price.replace(/,/g, ''));
      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const priceValue = parseInt(formData.price.replace(/,/g, ''));
    
    const data = {
      name: formData.name.trim(),
      price: priceValue,
      status: formData.status,
    };

    await onSave(data);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePriceChange = (value: string) => {
    handleInputChange('price', value);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Add Consultation Type' : 'Edit Consultation Type'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultation Type Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Type
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter type name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (₦)
            </label>
            <PriceInput
              value={formData.price}
              onChange={handlePriceChange}
              placeholder="Enter Price"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]}
              placeholder="Select status"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="tertiary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'add' ? 'Add Type' : 'Update Type'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
