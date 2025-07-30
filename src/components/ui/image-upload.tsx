"use client";

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label?: string;
  helperText?: string;
  acceptedTypes?: string;
  maxDimensions?: string;
  onFileSelect?: (file: File | null) => void;
  className?: string;
  error?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  helperText,
  acceptedTypes = "PNG, JPG",
  maxDimensions = "800x400px",
  onFileSelect,
  className,
  error
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than 2MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return 'Please upload a valid image file (PNG, JPG)';
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    // Validate file
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      return;
    }

    // Clear any previous errors
    setValidationError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    onFileSelect?.(file);
  }, [onFileSelect]);

  const handleRemoveFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Call onFileSelect with null to indicate file removal
    if (onFileSelect) {
      onFileSelect(null);
    }
  }, [previewUrl, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayError = error || validationError;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#162844]">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative border-1 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          "hover:border-[#4A85E4] hover:bg-[#F7F9FC]/50",
          isDragOver && "border-[#4A85E4] bg-[#F7F9FC]",
          selectedFile && "border-[#4A85E4] bg-[#F7F9FC]",
          displayError && "border-red-300",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Cloud Upload Icon */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          
          {/* Upload Text */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#162844]">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes} (max. {maxDimensions}, 2MB)
            </p>
            {/* Selected File Name - inline with upload text */}
            {selectedFile && (
              <p className="text-xs text-[#4A85E4] font-medium mt-1">
                {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {previewUrl && selectedFile && (
        <div className="relative mt-4">
          <div className="relative inline-block">
            <Image
              src={previewUrl}
              alt="Preview"
              width={100}
              height={100}
              unoptimized
              className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200 object-contain"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {displayError && (
        <p className="text-xs text-red-600">{displayError}</p>
      )}
      
      {helperText && !displayError && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}; 