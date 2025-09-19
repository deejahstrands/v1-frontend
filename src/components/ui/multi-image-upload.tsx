"use client";

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiImageUploadProps {
  label?: string;
  helperText?: string;
  acceptedTypes?: string;
  maxDimensions?: string;
  maxFiles?: number;
  files: (File | string)[];
  onFilesChange: (files: (File | string)[]) => void;
  className?: string;
  error?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  label,
  helperText,
  acceptedTypes = "PNG, JPG",
  maxDimensions = "800x400px",
  maxFiles = 5,
  files,
  onFilesChange,
  className,
  error
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
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

  const handleFileSelect = useCallback((newFiles: File[]) => {
    // Filter out invalid files and show errors
    const validFiles: File[] = [];
    let errorMessage = '';

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        errorMessage = error;
        break;
      }
      validFiles.push(file);
    }

    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    // Check if adding these files would exceed max files
    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      setValidationError(`Maximum ${maxFiles} files allowed. You're trying to add ${totalFiles} files.`);
      return;
    }

    // Clear any previous errors
    setValidationError(null);

    // Add new files to existing files
    onFilesChange([...files, ...validFiles] as (File | string)[]);
  }, [files, maxFiles, onFilesChange]);

  const handleRemoveFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    setValidationError(null);
  }, [files, onFilesChange]);

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
    // Reset input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const displayError = error || validationError;
  const canAddMore = files.length < maxFiles;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#162844]">
          {label}
        </label>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={cn(
            "relative border-1 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            "hover:border-[#4A85E4] hover:bg-[#F7F9FC]/50",
            isDragOver && "border-[#4A85E4] bg-[#F7F9FC]",
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
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            {/* Upload Icon */}
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              {files.length > 0 ? <Plus className="w-6 h-6 text-gray-400" /> : <Upload className="w-6 h-6 text-gray-400" />}
            </div>
            
            {/* Upload Text */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#162844]">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptedTypes} (max. {maxDimensions}, 2MB each)
              </p>
              <p className="text-xs text-gray-400">
                {files.length}/{maxFiles} files selected
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <div className="relative inline-block w-full">
                <Image
                  src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={100}
                  unoptimized
                  className="w-full h-24 rounded-lg border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {typeof file === 'string' ? file.split('/').pop() || 'Image' : file.name}
              </p>
            </div>
          ))}
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
