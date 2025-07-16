"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, helperText, id, name, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name || `password-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            name={name}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              "w-full px-3 py-2 pr-10 rounded-lg border bg-white transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[#C9A898] focus:border-transparent",
              "placeholder:text-gray-400",
              error 
                ? "border-red-300 focus:ring-red-500" 
                : "border-gray-200 hover:border-gray-300",
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput }; 