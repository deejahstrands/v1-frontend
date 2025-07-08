import * as Accordion from '@radix-ui/react-accordion';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDelivery } from '@/store/use-delivery';

interface DeliveryOption {
  label: string;
  price: number;
}

interface DeliveryType {
  type: string;
  options: DeliveryOption[];
}

interface ProductDeliveryAccordionProps {
  delivery: DeliveryType[];
}

const ProductDeliveryAccordion: React.FC<ProductDeliveryAccordionProps> = ({ delivery }) => {
  const [openType, setOpenType] = useState<string>('');
  const setSelected = useDelivery(state => state.setSelected);
  const selected = useDelivery(state => state.selected);

  // Initialize selected options to first option for each type
  useEffect(() => {
    delivery.forEach(d => {
      if (!selected[d.type] && d.options[0]) {
        setSelected(d.type, d.options[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery]);

  const handleSelect = (type: string, option: DeliveryOption) => {
    setSelected(type, option);
  };

  return (
    <Accordion.Root type="single" collapsible value={openType} onValueChange={setOpenType} className="rounded-2xl border-[0.5px] border-[#98A2B3] w-full max-w-md mx-auto mt-6">
      <div className="p-4 pb-0 text-base font-semibold">Delivery</div>
      {delivery.map((d) => (
        <Accordion.Item value={d.type} key={d.type} className="border-b border-gray-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full justify-between items-center px-4 py-3 text-left font-medium text-sm sm:text-base focus:outline-none">
              <span>
                {d.type}
                {selected[d.type] && (
                  <span className="ml-2 text-xs sm:text-sm text-gray-500 font-normal">
                    (
                    {selected[d.type]?.label}
                    {selected[d.type]?.price ? ` - ₦${selected[d.type]?.price.toLocaleString()}` : ''}
                    )
                  </span>
                )}
              </span>
              <svg className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                  {d.options.map((option) => {
                    const isSelected = selected[d.type]?.label === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        className={`flex justify-between items-center border-[0.5px] border-[#98A2B3] rounded-lg px-3 py-2 text-sm sm:text-base w-full transition-colors
                          ${isSelected ? 'bg-secondary font-semibold' : ''}`}
                        onClick={() => handleSelect(d.type, option)}
                      >
                        <span>{option.label}</span>
                        {option.price ? <span className="text-gray-700 font-medium">₦{option.price.toLocaleString()}</span> : null}
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

export default ProductDeliveryAccordion; 