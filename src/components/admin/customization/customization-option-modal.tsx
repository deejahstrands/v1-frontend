"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { X, Save, Plus, Edit } from 'lucide-react';
import { CustomizationOption } from '@/services/admin';
import { useCustomizationTypesStore } from '@/store/admin';


interface CustomizationOptionModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  option?: CustomizationOption;
  onSave: (data: {
    name: string;
    description?: string;
    typeId: string;
    status: 'active' | 'hidden';
  }) => Promise<void>;
}

export function CustomizationOptionModal({
    open,
    onClose,
    mode,
    option,
    onSave,
}: CustomizationOptionModalProps) {
    const { types: customizationTypes = [], fetchTypes } = useCustomizationTypesStore();

  // Form state
      const [formData, setFormData] = useState({
        name: '',
        description: '',
        typeId: '',
        status: 'active' as 'active' | 'hidden',
    });

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

  // Load customization types on mount
  useEffect(() => {
    if (open) {
      fetchTypes(); // Get all types without pagination
    }
  }, [open, fetchTypes]);

      // Reset form when modal opens/closes or option changes
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && option) {
                setFormData({
                    name: option.name,
                    description: option.description || '',
                    typeId: option.customizationType.id,
                    status: option.status,
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    typeId: '',
                    status: 'active',
                });
            }
            setErrors({});
        }
    }, [open, mode, option]);

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
            newErrors.name = 'Option name is required';
        }

        if (!formData.typeId) {
            newErrors.typeId = 'Please select a customization type';
        }

        if (!formData.status) {
            newErrors.status = 'Please select a status';
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
            await onSave({
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                typeId: formData.typeId,
                status: formData.status,
            });
        } catch (error) {
            // Error is handled by the parent component
            console.error('Error saving option:', error);
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
                                {mode === 'edit' ? 'Edit Customization Option' : 'Add Customization Option'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {mode === 'edit' ? 'Update the customization option details' : 'Create a new customization option'}
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
                    {/* Option Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Option Name *
                        </label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter option name"
                            error={errors.name}
                            className="w-full"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Customization Type */}
                    <div>
                        <label htmlFor="typeId" className="block text-sm font-medium text-gray-700 mb-2">
                            Customization Type *
                        </label>
                        {customizationTypes.length > 0 ? (
                            <Select
                                options={customizationTypes.map(type => ({
                                    label: type.name,
                                    value: type.id
                                }))}
                                value={formData.typeId}
                                onChange={(value) => handleInputChange('typeId', value)}
                                placeholder="Select customization type"
                                required
                            />
                        ) : (
                            <div className="text-sm text-gray-500">Loading types...</div>
                        )}
                        {errors.typeId && (
                            <p className="mt-1 text-sm text-red-600">{errors.typeId}</p>
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
                            placeholder="Internal description for reference"
                            className="w-full"
                        />
                    </div>

                    {/* Visibility Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Visibility Status *
                        </label>
                        <Select
                            options={[
                                { label: 'Active', value: 'active' },
                                { label: 'Hidden', value: 'hidden' }
                            ]}
                            value={formData.status}
                                                         onChange={(value) => handleInputChange('status', value as 'active' | 'hidden')}
                            placeholder="Select status"
                            required
                        />
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
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
                            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Option' : 'Add Option'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
