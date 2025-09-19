import * as Accordion from '@radix-ui/react-accordion';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDelivery } from '@/store/use-delivery';
import { Info } from 'lucide-react';

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
  const [showProcessingInfo, setShowProcessingInfo] = useState(false);
  const setSelected = useDelivery(state => state.setSelected);
  const selected = useDelivery(state => state.selected);

  // Initialize selected options to "None" (first option) for each type
  useEffect(() => {
    delivery.forEach(d => {
      if (!selected[d.type] && d.options[0]) {
        setSelected(d.type, d.options[0]); // This will be "None" option
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delivery]);

  const handleSelect = (type: string, option: DeliveryOption) => {
    setSelected(type, option);
  };

  return (
    <Accordion.Root type="single" collapsible value={openType} onValueChange={setOpenType} className="rounded-2xl border-[0.5px] border-[#98A2B3] w-full max-w-md mx-auto mt-6">
      <div className="p-4 pb-0 text-base font-semibold">Delivery - <span>Select below </span></div>
      {delivery.map((d) => (
        <Accordion.Item value={d.type} key={d.type} className="border-b border-gray-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full justify-between items-center px-4 py-3 text-left font-medium text-sm sm:text-base focus:outline-none">
              <span className="flex items-center gap-2">
                {d.type}
                {d.type === 'Processing Time' && (
                  <div className="relative">
                    <div
                      className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs hover:bg-gray-800 transition-colors cursor-pointer"
                      onMouseEnter={() => setShowProcessingInfo(true)}
                      onMouseLeave={() => setShowProcessingInfo(false)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProcessingInfo(!showProcessingInfo);
                      }}
                    >
                      <Info className="w-3 h-3" />
                    </div>
                    {showProcessingInfo && (
                      <div className="absolute top-0 left-full ml-3 min-w-[176px] h-auto px-4 py-3 bg-[#98A2B3] text-white text-sm rounded-lg shadow-xl z-50">
                        <div className="text-gray-100 leading-relaxed">
                          Processing time refers to how long it takes to prepare your custom order after payment is made. It does not include shipping time.
                        </div>
                        <div className="absolute top-4 -left-2 w-0 h-0 border-t-2 border-b-2 border-r-2 border-l-0 border-transparent border-r-[#98A2B3]"></div>
                      </div>
                    )}
                  </div>
                )}
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