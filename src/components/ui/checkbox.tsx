"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ 
  id, 
  checked, 
  onCheckedChange, 
  disabled = false,
  className = ""
}: CheckboxProps) {
  const handleClick = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleClick}
      disabled={disabled}
              className={`
          w-4 h-4 border-2 rounded flex items-center justify-center transition-all
          ${checked 
            ? 'bg-black border-black text-white' 
            : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && <Check className="w-3 h-3" />}
    </button>
  );
}
