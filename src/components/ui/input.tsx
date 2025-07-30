import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, name, required, ...props }, ref) => {
    const inputId = id || name || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#162844]">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          name={name}
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-[#F7F9FC] transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#4A85E4] focus:border-transparent",
            "placeholder:text-gray-400",
            error 
              ? "border-red-300 focus:ring-red-500" 
              : "border-[#E9EAEB] hover:border-[#4A85E4]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[10px] text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-[10px] text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input }; 