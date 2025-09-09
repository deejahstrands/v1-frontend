"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessingTimeData {
    label: string;
    timeRange: string;
    status: 'Active' | 'Inactive';
    default: boolean;
}

interface EditProcessingTimeModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ProcessingTimeData) => Promise<void>;
    processingTime?: ProcessingTimeData & { id: string } | null;
}

const initialFormData: ProcessingTimeData = {
    label: '',
    timeRange: '',
    status: 'Active',
    default: false,
};

const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
];

export function EditProcessingTimeModal({
    open,
    onClose,
    onSave,
    processingTime
}: EditProcessingTimeModalProps) {
    const [formData, setFormData] = useState<ProcessingTimeData>(initialFormData);
    const [originalFormData, setOriginalFormData] = useState<ProcessingTimeData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    // Reset form when modal opens/closes or processingTime changes
    useEffect(() => {
        if (open && processingTime) {
            const processingTimeData = {
                label: processingTime.label,
                timeRange: processingTime.timeRange,
                status: processingTime.status,
                default: processingTime.default,
            };
            setFormData(processingTimeData);
            setOriginalFormData(processingTimeData);
            setErrors({});
        }
    }, [open, processingTime]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.label.trim()) {
            newErrors.label = 'Label is required';
        }

        if (!formData.timeRange.trim()) {
            newErrors.timeRange = 'Time range is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getChangedFields = () => {
        const changedFields: Partial<ProcessingTimeData> = {};

        Object.keys(formData).forEach(key => {
            const field = key as keyof ProcessingTimeData;
            if (formData[field] !== originalFormData[field]) {
                (changedFields as Record<string, string | boolean>)[field] = formData[field];
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
            // For edit, only send changed fields
            const changedFields = getChangedFields();
            if (Object.keys(changedFields).length === 0) {
                toast.info('No changes detected');
                onClose();
                return;
            }
            await onSave({ ...formData, ...changedFields });
            onClose();
        } catch (error) {
            console.error('Error updating processing time:', error);
            toast.error('Failed to update processing time. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof ProcessingTimeData, value: string | boolean) => {
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
                            <Edit className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Edit Processing Time
                            </h2>
                            <p className="text-sm text-gray-500">
                                Update the processing time details
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
                    {/* Label */}
                    <div>
                        <Input
                            label="Label"
                            placeholder="Enter label name"
                            value={formData.label}
                            onChange={(e) => handleInputChange('label', e.target.value)}
                            error={errors.label}
                            required
                        />
                    </div>

                    {/* Time Range */}
                    <div>
                        <Input
                            label="Time Range"
                            placeholder="E.g 2 - 3 working days"
                            value={formData.timeRange}
                            onChange={(e) => handleInputChange('timeRange', e.target.value)}
                            error={errors.timeRange}
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
                            {isSubmitting ? 'Updating...' : 'Update Processing Time'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
