"use client";

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CustomizationType {
  id: string;
  name: string;
  description: string;
}

interface TypeCheckboxProps {
  type: CustomizationType;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function TypeCheckbox({ type, checked, onCheckedChange, disabled = false }: TypeCheckboxProps) {
  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <Checkbox
        id={type.id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="data-[state=checked]:bg-black data-[state=checked]:border-black"
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={type.id}
          className="text-sm font-medium text-gray-900 cursor-pointer"
        >
          {type.name}
        </label>
        {type.description && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {type.description}
          </p>
        )}
      </div>
    </div>
  );
}
