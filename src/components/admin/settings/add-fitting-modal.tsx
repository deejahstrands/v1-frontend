"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FittingOptionData {
    name: string;
    type: string;
    location: string;
    status: 'Active' | 'Inactive';
    default: boolean;
}

interface AddFittingModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: FittingOptionData) => Promise<void>;
}

const initialFormData: FittingOptionData = {
    name: '',
    type: '',
    location: '',
    status: 'Active',
    default: false,
};

const fittingTypeOptions = [
    { label: 'Physical', value: 'Physical' },
    { label: 'Virtual', value: 'Virtual' },
    { label: 'Hybrid', value: 'Hybrid' },
];

const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
];

export function AddFittingModal({
    open,
    onClose,
    onSave
}: AddFittingModalProps) {
    const [formData, setFormData] = useState<FittingOptionData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            setFormData(initialFormData);
            setErrors({});
        }
    }, [open]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Fitting name is required';
        }

        if (!formData.type) {
            newErrors.type = 'Fitting type is required';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
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
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving fitting option:', error);
            toast.error('Failed to save fitting option. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof FittingOptionData, value: string | boolean) => {
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
                            <Plus className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Add Fitting Option
                            </h2>
                            <p className="text-sm text-gray-500">
                                Create a new fitting option for customers
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
                    {/* Fitting Name */}
                    <div>
                        <Input
                            label="Fitting Name"
                            placeholder="Enter fitting name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            error={errors.name}
                            required
                        />
                    </div>

                    {/* Fitting Type */}
                    <div>
                        <Select
                            label="Fitting Type"
                            placeholder="Select Fitting Type"
                            options={fittingTypeOptions}
                            value={formData.type}
                            onChange={(value) => handleInputChange('type', value)}
                            error={errors.type}
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <Input
                            label="Location"
                            placeholder="Enter Location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            error={errors.location}
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <Select
                            label="Status"
                            placeholder="Select Status"
                            options={statusOptions}
                            value={formData.status}
                            onChange={(value) => handleInputChange('status', value)}
                            error={errors.status}
                            required
                        />
                    </div>

                    {/* Set as Default */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="default"
                            checked={formData.default}
                            onCheckedChange={(checked) => handleInputChange('default', checked as boolean)}
                        />
                        <label htmlFor="default" className="text-sm font-medium text-gray-700">
                            Set as Default
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="tertiary"
                            onClick={onClose}
                            className="flex-1 border"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Fitting'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
