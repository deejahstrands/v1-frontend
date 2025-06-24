import React from "react";

export interface FilterOption {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selected?: string;
  onSelect: (value: string) => void;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selected,
  onSelect,
  className = "",
}) => {
  return (
    <div className={`w-56 p-2 grid grid-cols-2 gap-2 ${className}`}>
      <div className="col-span-2 px-2 pb-2 text-sm font-semibold text-gray-700">Add Filter</div>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 border transition-colors text-xs font-medium
            ${selected === opt.value ? "bg-gray-200 border-gray-300 text-gray-900" : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
        >
          <span className="text-xl">{opt.icon}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}; 