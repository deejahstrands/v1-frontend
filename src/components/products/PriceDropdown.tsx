import { useState } from "react";
import { ChevronDown } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

interface PriceDropdownProps {
  value: [number, number];
  onChange: (val: [number, number]) => void;
  onApply: () => void;
  onReset: () => void;
  min: number;
  max: number;
}

const formatPrice = (val: number) => `₦${val.toLocaleString()}`;

const PriceDropdown = ({ value, onChange, onApply, onReset, min, max }: PriceDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-white text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
          <span className="text-black">Price</span>
          <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-4 w-80 bg-white border border-gray-200">
        <div className="mb-2 text-sm font-semibold">Range</div>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-6 mb-2"
          min={min}
          max={max}
          step={10000}
          value={value}
          onValueChange={val => onChange([val[0], val[1]])}
          minStepsBetweenThumbs={1}
        >
          <Slider.Track className="bg-primary h-1 rounded-full w-full">
            <Slider.Range className="absolute bg-black h-1 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary" />
          <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary" />
        </Slider.Root>
        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-4">
          <span>{formatPrice(value[0])}</span>
          <span>{formatPrice(value[1])}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 bg-white text-xs font-medium hover:bg-gray-100 transition cursor-pointer"
            onClick={() => { onReset(); }}
            type="button"
          >
            Reset
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-md border border-primary bg-primary text-white text-xs font-medium hover:bg-primary/90 transition cursor-pointer"
            onClick={() => { onApply(); setOpen(false); }}
            type="button"
          >
            Apply
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriceDropdown; 