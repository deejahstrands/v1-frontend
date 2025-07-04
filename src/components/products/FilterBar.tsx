'use client'

import { SearchInput } from "@/components/ui/search-input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/common/button";
import { useState, useRef } from "react";
import { Filter as FilterIcon, ChevronDown, LayoutGrid, Rows3, Rows2 } from "lucide-react";
import { debounce } from "lodash";
import { SectionContainer } from "@/components/common/section-container";
import * as Slider from "@radix-ui/react-slider";
import { useProductGrid } from "@/store/use-product-grid";
import { motion, AnimatePresence } from "motion/react";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Alphabetically, A - Z", value: "az" },
  { label: "Alphabetically, Z - A", value: "za" },
  { label: "Price, Low to High", value: "price-asc" },
  { label: "Price, High to Low", value: "price-desc" },
];

const GRID_OPTIONS = [
  { value: 4, icon: LayoutGrid },
  { value: 3, icon: Rows3 },
  { value: 2, icon: Rows2 },
];

const PRICE_MIN = 350000;
const PRICE_MAX = 1600000;

export const FilterBar = () => {
  // State for filters
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceDraft, setPriceDraft] = useState<[number, number]>(price);

  // TODO: Replace with real product count
  const productCount = 120;

  // Debounced search handler using useRef
  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      // TODO: Trigger search/filter logic here
      console.log('Debounced search:', value);
    }, 400)
  );

  const handleSearchInput = (value: string) => {
    setSearch(value);
    debouncedSearchRef.current(value);
  };

  // Handlers
  const handleApplyPrice = () => {
    setPrice(priceDraft);
    // TODO: Trigger filter update
    setMobileOpen(false);
  };
  const handleResetPrice = () => {
    setPriceDraft([PRICE_MIN, PRICE_MAX]);
  };

  // Format price for display
  const formatPrice = (val: number) => `₦${val.toLocaleString()}`;

  // Responsive design
  const { grid, setGrid } = useProductGrid();

  return (
    <SectionContainer className="mb-6">
      {/* Desktop */}
      <div className="hidden lg:flex items-center justify-between gap-4 bg-tertiary rounded-xl px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 w-full max-w-lg">
          <SearchInput value={search} onChange={handleSearchInput} placeholder="Search for hairs..." />
          <div className="flex flex-col gap-1 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-black">Price</span>
              <span className="text-xs font-semibold text-gray-400">{formatPrice(priceDraft[0])} - {formatPrice(priceDraft[1])}</span>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-6"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={10000}
              value={priceDraft}
              onValueChange={value => setPriceDraft([value[0], value[1]])}
              minStepsBetweenThumbs={1}
            >
              <Slider.Track className="bg-primary h-1 rounded-full w-full">
                <Slider.Range className="absolute bg-black h-1 rounded-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary" />
              <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary" />
            </Slider.Root>
            <div className="flex gap-2 mt-1">
              <button
                className="px-4 py-1 rounded-md border border-primary bg-primary text-white text-xs font-medium hover:bg-primary/90 transition"
                onClick={handleApplyPrice}
              >
                Apply
              </button>
              <button
                className="px-4 py-1 rounded-md border border-gray-300 bg-white text-xs font-medium hover:bg-gray-100 transition"
                onClick={handleResetPrice}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 min-w-[320px] justify-end">
          <span className="text-sm text-gray-400">{productCount} Products</span>
          <span className="mx-2 text-gray-300">|</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-white text-sm font-semibold hover:bg-gray-100 transition">
                <span className="text-gray-500 font-normal">Sort by:</span>
                <span className="text-black font-semibold ml-1">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map(option => (
                <DropdownMenuItem key={option.value} onClick={() => setSort(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Grid view toggle (desktop only) */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {GRID_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setGrid(opt.value)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border transition
                    ${grid === opt.value ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200 hover:bg-gray-100"}
                  `}
                  aria-label={`Show ${opt.value} per row`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Mobile */}
      <div className="grid grid-cols-12 gap-2 lg:hidden w-full mt-8">
        <div className="col-span-10">
          <SearchInput value={search} onChange={handleSearchInput} placeholder="Search for hairs..." className="w-full" />
        </div>
        <div className="col-span-2 flex items-center">
          <Button variant="tertiary" className="p-2 w-full" onClick={() => setMobileOpen(true)}>
            <FilterIcon className="w-5 h-5 mx-auto" />
          </Button>
        </div>
      </div>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 animate-in fade-in-0"
          >
            <div className="bg-white rounded-t-2xl p-4 w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Filters</span>
                <Button variant="tertiary" className="p-2" onClick={() => setMobileOpen(false)}>×</Button>
              </div>
              <div className="mb-4">
                <span className="block text-xs font-medium mb-2">Sort By</span>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {SORT_OPTIONS.map(option => (
                    <Button key={option.value} variant={sort === option.value ? "primary" : "tertiary"} className="whitespace-nowrap px-3 py-1 text-xs" onClick={() => setSort(option.value)}>
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <span className="block text-xs font-medium mb-2">Price</span>
                <span className="block text-xs font-semibold text-gray-400 mb-1">{formatPrice(priceDraft[0])} - {formatPrice(priceDraft[1])}</span>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-6"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={10000}
                  value={priceDraft}
                  onValueChange={value => setPriceDraft([value[0], value[1]])}
                  minStepsBetweenThumbs={1}
                >
                  <Slider.Track className="bg-primary h-1 rounded-full w-full">
                    <Slider.Range className="absolute bg-black h-1 rounded-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary" />
                  <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary" />
                </Slider.Root>
                <div className="flex gap-2 mt-2">
                  <Button variant="tertiary" className="px-2 py-1 text-xs" onClick={handleResetPrice}>Reset</Button>
                </div>
              </div>
              <Button variant="primary" className="w-full mt-4" onClick={handleApplyPrice}>Apply Filters</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionContainer>
  );
}; 