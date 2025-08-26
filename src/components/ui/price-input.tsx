"use client";

import React from 'react';
import { Plus, Hash } from 'lucide-react';
import { Input } from './input';

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function PriceInput({ 
  value, 
  onChange, 
  placeholder = "0", 
  error, 
  className = "",
  disabled = false 
}: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove all non-digit characters except decimal point
    const cleanValue = inputValue.replace(/[^\d.]/g, '');
    
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(cleanValue) || cleanValue === '') {
      // Format with commas
      const formattedValue = formatWithCommas(cleanValue);
      onChange(formattedValue);
    }
  };

  // Function to format number with commas
  const formatWithCommas = (value: string): string => {
    if (!value) return '';
    
    // Split by decimal point if exists
    const parts = value.split('.');
    const wholePart = parts[0];
    const decimalPart = parts[1];
    
    // Add commas to whole number part
    const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Return with decimal part if exists
    return decimalPart ? `${formattedWhole}.${decimalPart}` : formattedWhole;
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none gap-1">
        <Plus className="w-4 h-4 text-gray-500" />
        <Hash className="w-4 h-4 text-gray-500" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        className={`pl-12  ${className}`}
      />
    </div>
  );
}
