"use client";

import * as Accordion from '@radix-ui/react-accordion';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomization } from '@/store/use-customization';
import { CustomizationType } from '@/data/customization';
import { Plus } from 'lucide-react';

interface CustomizationAccordionProps {
  className?: string;
}

export const CustomizationAccordion: React.FC<CustomizationAccordionProps> = ({ className }) => {
  const [openType, setOpenType] = useState<string>('');
  const { selectedWigType, selectedOptions, setSelectedOption } = useCustomization();

  if (!selectedWigType) {
    return (
      <div className={className}>
        <div className="bg-white rounded-xl p-6 border border-[#98A2B3] w-full max-w-md mx-auto">
          <div className="text-center text-gray-500">
            Please select a wig type first to customize
          </div>
        </div>
      </div>
    );
  }

  const handleSelect = (type: string, option: { label: string; price?: number }) => {
    setSelectedOption(type, option);
  };

  return (
    <div className={className}>
      <Accordion.Root
        type="single"
        collapsible
        value={openType}
        onValueChange={setOpenType}
        className="rounded-2xl border-[0.5px] border-[#98A2B3] w-full max-w-md mx-auto"
      >
        <div className="p-4 pb-0 text-base font-semibold">Customize your {selectedWigType.name} Wig</div>

        {selectedWigType.customizations.map((custom: CustomizationType) => (
          <Accordion.Item value={custom.type} key={custom.type} className="border-b border-gray-200">
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full justify-between items-center px-4 py-3 text-left font-medium text-sm sm:text-base focus:outline-none cursor-pointer">
                <span>
                  {custom.type}
                  {selectedOptions[custom.type] && (
                    <span className="ml-2 text-xs sm:text-sm text-gray-500 font-normal">
                      (
                      {selectedOptions[custom.type]?.label}
                      {selectedOptions[custom.type]?.price ? ` - ₦${selectedOptions[custom.type]?.price?.toLocaleString()}` : ''}
                      )
                    </span>
                  )}
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
                    opacity: { duration: 0.2 }
                  }}
                  className="px-4 pb-4"
                >
                  <div className="flex flex-col gap-2">
                    {/* None option */}
                    <button
                      key={`${custom.type}-none`}
                      type="button"
                      className={`flex justify-between items-center border-[0.5px] border-[#98A2B3] rounded-lg px-3 py-2 text-sm sm:text-base w-full transition-colors cursor-pointer
                        ${!selectedOptions[custom.type] ? 'bg-secondary font-semibold' : 'hover:bg-gray-50'}`}
                      onClick={() => handleSelect(custom.type, { label: 'None', price: 0 })}
                    >
                      <span>None</span>
                      <span className="text-gray-700 font-medium">₦0</span>
                    </button>

                    {custom.options.map((option) => {
                      const isSelected = selectedOptions[custom.type]?.label === option.label;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          className={`flex justify-between items-center border-[0.5px] border-[#98A2B3] rounded-lg px-3 py-2 text-sm sm:text-base w-full transition-colors cursor-pointer
                            ${isSelected ? 'bg-secondary font-semibold' : 'hover:bg-gray-50'}`}
                          onClick={() => handleSelect(custom.type, option)}
                        >
                          <span>{option.label}</span>
                          {option.price ? (
                            <span className="text-gray-700 font-medium">
                              <Plus className="inline-block w-3 h-3 mr-1" />
                              ₦{option.price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">Included</span>
                          )}
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
    </div>
  );
}; 