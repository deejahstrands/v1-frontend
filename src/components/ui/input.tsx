import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, name, ...props }, ref) => {
    const inputId = id || name || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          name={name}
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-white transition-colors",
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

Input.displayName = 'Input';

export { Input }; 