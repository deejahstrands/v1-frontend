"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Please select",
  options,
  value,
  onChange,
  error,
  helperText,
  className,
  required,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    value ? options.find(opt => opt.value === value) || null : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.value === value);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#162844]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-[#F7F9FC] text-left transition-colors",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-[#4A85E4] focus:border-transparent",
            !disabled && "hover:bg-[#F7F9FC]/80",
            error 
              ? "border-red-300 focus:ring-red-500" 
              : "border-[#E9EAEB]",
            !selectedOption && "text-gray-400",
            className
          )}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#E9EAEB] rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-[#F7F9FC] transition-colors cursor-pointer",
                  selectedOption?.value === option.value && "bg-[#F7F9FC] text-[#4A85E4] font-medium"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}; 