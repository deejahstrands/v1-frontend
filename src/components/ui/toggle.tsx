"use client";

import React from 'react';
import * as Switch from '@radix-ui/react-switch';

interface ToggleProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Toggle({ 
  id, 
  checked, 
  onCheckedChange, 
  disabled = false,
  className = "",
  size = 'md'
}: ToggleProps) {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-6',
    lg: 'w-12 h-7'
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-4',
    lg: 'translate-x-5'
  };

  return (
    <Switch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} 
        rounded-full relative outline-none transition-colors duration-200
        ${checked ? 'bg-black' : 'bg-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-checked={checked}
      role="switch"
    >
      <Switch.Thumb 
        className={`
          block ${thumbSizeClasses[size]} bg-white rounded-full shadow transition-transform duration-200
          ${checked ? translateClasses[size] : 'translate-x-0'}
        `} 
      />
    </Switch.Root>
  );
}
