import * as Accordion from '@radix-ui/react-accordion';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CapSizeGuideContent from './CapSizeGuideContent';
import DisclaimersContent from './DisclaimersContent';
import ShippingInfoContent from './ShippingInfoContent';

const sections = [
  {
    value: 'cap-size-guide',
    label: 'Cap size guide',
    Content: CapSizeGuideContent,
  },
  {
    value: 'disclaimers',
    label: 'Disclaimers (PLEASE READ)',
    Content: DisclaimersContent,
  },
  {
    value: 'shipping-info',
    label: 'Shipping Information',
    Content: ShippingInfoContent,
  },
];

const OthersAccordion: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('');

  return (
    <Accordion.Root
      type="single"
      collapsible
      value={openSection}
      onValueChange={setOpenSection}
      className="rounded-2xl border-[0.5px] border-[#98A2B3] w-full max-w-md mx-auto mt-5"
    >
      <div className="p-4 pb-0 text-base font-bold">OTHERS</div>
      {sections.map(({ value, label, Content }) => (
        <Accordion.Item value={value} key={value} className="border-b border-gray-200">
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full justify-between items-center px-4 py-3 text-left font-medium text-sm sm:text-base focus:outline-none">
              <span>{label}</span>
              <svg className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden">
            <AnimatePresence initial={false}>
              {openSection === value && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1], opacity: { duration: 0.2 } }}
                  className="px-4 pb-4"
                >
                  <Content />
                </motion.div>
              )}
            </AnimatePresence>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default OthersAccordion; 