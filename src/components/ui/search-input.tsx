"use client";

import React, { useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceDelay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onDebouncedChange,
  placeholder = "Search...",
  className = "",
  debounceDelay = 300,
}) => {
  // Use useRef to store the timeout ID
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Call debounced change if provided
    if (onDebouncedChange) {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        onDebouncedChange(newValue);
      }, debounceDelay);
    }
  };

  return (
    <div className={`relative w-full${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm bg-white"
      />
    </div>
  );
}; 