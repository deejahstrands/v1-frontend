"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload } from 'lucide-react';

interface GalleryImage {
    id: string;
    file?: File;
    url: string;
    isExisting?: boolean;
    type?: 'image' | 'video';
}

interface GalleryUploadProps {
    label?: string;
    helperText?: string;
    acceptedTypes?: string;
    maxDimensions?: string;
    maxImages?: number;
    onImagesChange?: (images: GalleryImage[]) => void;
    existingImages?: string[];
    className?: string;
    error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const GalleryUpload: React.FC<GalleryUploadProps> = ({
    label = "Gallery",
    helperText = "Share a few snippets of this product",
    acceptedTypes = "PNG, JPG, GIF, & MP4",
    maxDimensions = "800x400px",
    maxImages = 4,
    onImagesChange,
    existingImages = [],
    className = "",
    error
}) => {
    const [images, setImages] = useState<GalleryImage[]>(() => {
        // Initialize with existing images
        return existingImages.map((url, index) => ({
            id: `existing-${index}`,
            url,
            isExisting: true
        }));
    });

    // Call onImagesChange when images state changes
    useEffect(() => {
        onImagesChange?.(images);
    }, [images, onImagesChange]);

    const validateFile = (file: File): string | null => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return `File size must be less than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4'];
        if (!validTypes.includes(file.type)) {
            return 'Please upload a valid file (PNG, JPG, GIF, MP4)';
        }

        return null;
    };

    const handleFileSelect = useCallback((file: File, index: number) => {
        // Validate file
        const error = validateFile(file);
        if (error) {
            console.error('File validation error:', error);
            return;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        
        // Determine file type
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        
        const newImage: GalleryImage = {
            id: `upload-${Date.now()}-${index}`,
            file,
            url,
            type
        };

        setImages(prev => {
            const updated = [...prev];
            updated[index] = newImage;
            return updated;
        });
    }, []);

    const handleRemoveImage = useCallback((index: number) => {
        setImages(prev => {
            const updated = [...prev];
            const imageToRemove = updated[index];

            // Clean up object URL if it's not an existing image
            if (imageToRemove && !imageToRemove.isExisting && imageToRemove.url) {
                URL.revokeObjectURL(imageToRemove.url);
            }

            updated[index] = {
                id: `empty-${index}`,
                url: ''
            };

            return updated;
        });
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0], index);
        }
    }, [handleFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileSelect(files[0], index);
        }
    }, [handleFileSelect]);

    // Cleanup object URLs on unmount
    React.useEffect(() => {
        return () => {
            images.forEach(image => {
                if (!image.isExisting && image.url) {
                    URL.revokeObjectURL(image.url);
                }
            });
        };
    }, [images]);

    const renderUploadCard = (index: number) => {
        const image = images[index];
        const isEmpty = !image || !image.url;

        return (
            <div
                key={image?.id || `empty-${index}`}
                className={`
          relative w-full h-32 border-2 border-dashed rounded-lg transition-colors
          ${isEmpty
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200'
                    }
          ${error ? 'border-red-300' : ''}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
            >
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">{acceptedTypes} (max. {maxDimensions})</p>
                        <input
                            type="file"
                            accept="image/*,video/mp4"
                            onChange={(e) => handleFileInput(e, index)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-full group">
                        {image.type === 'video' || image.url.startsWith('data:video/') || image.url.includes('.mp4') ? (
                            <video
                                src={image.url}
                                className="w-full h-full object-cover rounded-lg"
                                controls
                            />
                        ) : (
                            <Image
                                src={image.url}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                            />
                        )}

                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <div>
                    <h3 className="text-sm font-medium text-gray-900">{label}</h3>
                    {helperText && (
                        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: maxImages }, (_, index) => renderUploadCard(index))}
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
