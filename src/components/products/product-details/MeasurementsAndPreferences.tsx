"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { useMeasurements } from '@/store/use-measurements';

interface MeasurementsAndPreferencesProps {
  className?: string;
}

export const MeasurementsAndPreferences: React.FC<MeasurementsAndPreferencesProps> = ({
  className
}) => {
  const { data, setField } = useMeasurements();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const measurementOptions = [
    { label: 'Yes, I have my measurements', value: 'yes' },
    { label: 'No, I need help measuring', value: 'no' },
    { label: 'I\'m not sure', value: 'unsure' },
  ];

  const handleInputChange = (field: keyof typeof data, value: string) => {
    setField(field, value);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFilesChange = (field: 'hairlinePictures' | 'styleReference', files: (File | string)[]) => {
    setField(field, files);
    // Clear error when user selects files
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={className}>
      <div className="bg-white rounded-xl p-6 border border-[#98A2B3] w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#344054] mb-2">
            Measurements & Preferences
          </h3>
          <p className="text-sm text-gray-600">
            Fill out these details to build your Notification
          </p>
        </div>

        <div className="space-y-6">
          {/* Do you have your measurements */}
          <Select
            label="Do you have your measurements"
            options={measurementOptions}
            value={data.hasMeasurements}
            onChange={(value) => handleInputChange('hasMeasurements', value)}
            error={errors.hasMeasurements}
            required
          />

          {/* Conditional measurement fields */}
          {data.hasMeasurements === 'yes' && (
            <div className="space-y-4">
              <Input
                label="Head measurement - ear to ear"
                placeholder="Enter measurement in cm"
                value={data.earToEar}
                onChange={(e) => handleInputChange('earToEar', e.target.value)}
                error={errors.earToEar}
                required
              />

              <Input
                label="Head measurement - head circumference"
                placeholder="Enter measurement in cm"
                value={data.headCircumference}
                onChange={(e) => handleInputChange('headCircumference', e.target.value)}
                error={errors.headCircumference}
                required
              />
            </div>
          )}

          {/* Hairline Pictures */}
          <MultiImageUpload
            label="Front and side pictures of your hairline"
            helperText="(your images will not be shared or used for promotional activities)"
            acceptedTypes="PNG, JPG"
            maxDimensions="800x400px"
            maxFiles={3}
            files={data.hairlinePictures}
            onFilesChange={(files) => handleFilesChange('hairlinePictures', files)}
            error={errors.hairlinePictures}
          />

          {/* Style Reference */}
          <MultiImageUpload
            label="How would you like the wig styled - picture reference"
            acceptedTypes="PNG, JPG"
            maxDimensions="800x400px"
            maxFiles={3}
            files={data.styleReference}
            onFilesChange={(files) => handleFilesChange('styleReference', files)}
            error={errors.styleReference}
          />
        </div>
      </div>
    </div>
  );
}; 