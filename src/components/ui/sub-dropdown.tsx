"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface SubDropdownProps {
  options: { label: string; value: string }[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  title: string;
}

export const SubDropdown: React.FC<SubDropdownProps> = ({
  options,
  selected,
  onSelect,
  onClose,
  title,
}) => {
  return (
    <div className="w-56 bg-white rounded-lg p-2">
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2 hover:text-gray-900"
      >
        <ChevronLeft className="w-4 h-4" />
        {title}
      </button>
      <div className="space-y-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selected === opt.value
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}; 