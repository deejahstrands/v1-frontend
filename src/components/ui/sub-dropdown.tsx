"use client";

import React, { useEffect, useRef } from "react";

interface SubDropdownOption {
  label: string;
  value: string;
}

interface SubDropdownProps {
  options: SubDropdownOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  title?: string;
  className?: string;
}

export const SubDropdown: React.FC<SubDropdownProps> = ({
  options,
  selected,
  onSelect,
  onClose,
  title,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute left-full top-0 ml-2 w-48 rounded-lg shadow-lg bg-white border border-gray-100 z-50 p-3 animate-fade-in ${className}`}
    >
      {title && <div className="mb-2 text-sm font-semibold text-gray-700">{title}</div>}
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
              ${selected === opt.value ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}; 