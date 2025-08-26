"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';

import { X, Save, Plus, Edit } from 'lucide-react';
import { CustomizationType } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';

interface CreateCustomizationTypeData {
    name: string;
    description: string;
}

interface CustomizationTypeModalProps {
    open: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    type?: CustomizationType;
    onSave: (type: CreateCustomizationTypeData) => Promise<void>;
}

const initialFormData: CreateCustomizationTypeData = {
    name: '',
    description: '',
};

export function CustomizationTypeModal({
    open,
    onClose,
    mode,
    type,
    onSave
}: CustomizationTypeModalProps) {
    const [formData, setFormData] = useState<CreateCustomizationTypeData>(initialFormData);
    const [originalFormData, setOriginalFormData] = useState<CreateCustomizationTypeData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    // Reset form when modal opens/closes or mode changes
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && type) {
                const typeData = {
                    name: type.name,
                    description: type.description,
                };
                setFormData(typeData);
                setOriginalFormData(typeData);
            } else {
                setFormData(initialFormData);
                setOriginalFormData(initialFormData);
            }
            setErrors({});
        }
    }, [open, mode, type]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Type name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getChangedFields = () => {
        const changedFields: Partial<CreateCustomizationTypeData> = {};

        Object.keys(formData).forEach(key => {
            const field = key as keyof CreateCustomizationTypeData;
            if (formData[field] !== originalFormData[field]) {
                (changedFields as Record<string, string | 'active' | 'inactive'>)[field] = formData[field];
            }
        });

        return changedFields;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (mode === 'edit') {
                // For edit, only send changed fields
                const changedFields = getChangedFields();
                if (Object.keys(changedFields).length === 0) {
                    toast.info('No changes detected');
                    onClose();
                    return;
                }
                await onSave(changedFields as CreateCustomizationTypeData);
                toast.success(`${type?.name} updated successfully!`);
            } else {
                // For add, send all fields
                await onSave(formData);
                toast.success('Customization type added successfully!');
            }

            onClose();
        } catch (error) {
            console.error('Error saving customization type:', error);
            toast.error('Failed to save customization type. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof CreateCustomizationTypeData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };



    return (
        <Modal
            open={open}
            onClose={onClose}
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
                                {mode === 'edit' ? 'Edit Customization Type' : 'Add Customization Type'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {mode === 'edit' ? 'Update the customization type details' : 'Create a new customization type'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Type Name *
                        </label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter type name"
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
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter description"
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>



                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="tertiary"
                            onClick={onClose}
                            className="flex-1    border"
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
                            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Type' : 'Add Type'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
