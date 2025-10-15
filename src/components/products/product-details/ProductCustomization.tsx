import * as Accordion from "@radix-ui/react-accordion";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductCustomization } from "@/store/use-product-customization";

interface CustomizationOption {
  itemCustomizationId: string;
  customizationId: string;
  name: string;
  label: string;
  description: string;
  price: number;
  status: string;
}

interface Customization {
  type: string;
  options: CustomizationOption[];
}

interface ProductCustomizationProps {
  customizations: Customization[];
  onChange?: (type: string, option: CustomizationOption | null) => void;
}

const ProductCustomization: React.FC<ProductCustomizationProps> = ({
  customizations,
  onChange,
}) => {
  const [openType, setOpenType] = useState<string>("");
  const setSelected = useProductCustomization((state) => state.setSelected);
  const selected = useProductCustomization((state) => state.selected);

  // Initialize selected options to None (null) for each type
  useEffect(() => {
    customizations.forEach((custom) => {
      if (!selected[custom.type]) {
        setSelected(custom.type, null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customizations]);

  const handleSelect = (type: string, option: CustomizationOption | null) => {
    setSelected(type, option);
    if (onChange) onChange(type, option);
  };

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={openType}
      onValueChange={setOpenType}
      className="rounded-2xl border-[0.5px] border-[#98A2B3] w-full max-w-md mx-auto"
    >
      <div className="p-4 pb-0 text-base font-semibold">Customize your Wig</div>
      {customizations.map((custom) => (
        <Accordion.Item
          value={custom.type}
          key={custom.type}
          className="border-b border-gray-200"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full justify-between items-center px-4 py-3 text-left font-medium text-sm sm:text-base focus:outline-none cursor-pointer">
              <span>
                {custom.type}
                <span className="ml-2 text-xs sm:text-sm text-gray-500 font-normal">
                  ({selected[custom.type]?.label || "None"}
                  {selected[custom.type]?.price
                    ? ` - ₦${selected[custom.type]?.price?.toLocaleString()}`
                    : selected[custom.type] === null ? " - ₦0" : ""}
                  )
                </span>
              </span>
              <svg
                className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M6 8l4 4 4-4"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden">
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                  opacity: { duration: 0.2 },
                }}
                className="px-4 pb-4"
              >
                <div className="flex flex-col gap-2">
                  {/* None option */}
                  <button
                    key="none"
                    type="button"
                    className={`flex justify-between items-center border-[0.5px] border-[#98A2B3] rounded-lg px-3 py-2 text-sm sm:text-base w-full transition-colors cursor-pointer
                      ${!selected[custom.type] ? "bg-secondary font-semibold" : ""}`}
                    onClick={() => handleSelect(custom.type, null)}
                  >
                    <span>None</span>
                    <span className="text-gray-700 font-medium">₦0</span>
                  </button>
                  
                  {/* Actual options */}
                  {custom.options.map((option) => {
                    const isSelected =
                      selected[custom.type]?.label === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        className={`flex justify-between items-center border-[0.5px] border-[#98A2B3] rounded-lg px-3 py-2 text-sm sm:text-base w-full transition-colors cursor-pointer
                      ${isSelected ? "bg-secondary font-semibold" : ""}`}
                        onClick={() => handleSelect(custom.type, option)}
                      >
                        <span>{option.label}</span>
                        {option.price ? (
                          <span className="text-gray-700 font-medium">
                            ₦{option.price.toLocaleString()}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default ProductCustomization;
