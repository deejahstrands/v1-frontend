import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

interface CategoriesDropdownProps {
  categories: { name: string }[];
  selected: string[];
  onToggle: (cat: string) => void;
  onReset: () => void;
}

const CategoriesDropdown = ({ categories, selected, onToggle, onReset }: CategoriesDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-white text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition">
          <span className="text-black">Categories</span>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 py-2 bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs font-semibold text-gray-700">{selected.length} Selected</span>
          <button className="text-xs text-primary hover:underline" onClick={onReset} type="button">Reset</button>
        </div>
        <hr className="my-2" />
        <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
          {categories.map(cat => {
            const isChecked = selected.includes(cat.name);
            return (
              <label
                key={cat.name}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors select-none
                  ${isChecked ? 'bg-black text-white' : 'text-gray-800 hover:bg-gray-100'}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(cat.name)}
                  className="form-checkbox h-4 w-4 rounded border-2 border-black bg-white checked:bg-white checked:border-black focus:ring-0 focus:ring-offset-0 mr-1"
                  style={{ accentColor: isChecked ? '#fff' : undefined }}
                />
                <span>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesDropdown; 