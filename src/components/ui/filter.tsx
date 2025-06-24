"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";


interface FilterProps {
  buttonLabel?: string;
  children: React.ReactNode;
  className?: string;
  hasSubDropdownOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Filter: React.FC<FilterProps> = ({
  buttonLabel = "Filter",
  children,
  className = "",
  hasSubDropdownOpen = false,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  // Close on outside click or ESC
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleOpenChange(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") handleOpenChange(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleOpenChange, open]);

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => handleOpenChange(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-1">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {buttonLabel}
      </button>
      {(open || hasSubDropdownOpen) && (
        <div className="absolute right-0 mt-2 rounded-lg shadow-lg bg-white border border-gray-100 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}; 