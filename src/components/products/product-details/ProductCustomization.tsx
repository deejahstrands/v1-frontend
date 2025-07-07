import * as Accordion from '@radix-ui/react-accordion';
import React, { useState, useEffect } from 'react';
import { useProductCustomization } from '@/store/use-product-customization';

interface CustomizationOption {
    label: string;
    price?: number;
}

interface Customization {
    type: string;
    options: CustomizationOption[];
}

interface ProductCustomizationProps {
    customizations: Customization[];
    onChange?: (type: string, option: CustomizationOption) => void;
}

const ProductCustomization: React.FC<ProductCustomizationProps> = ({ customizations, onChange }) => {
    const [openType, setOpenType] = useState(customizations[0]?.type || '');
    const setSelected = useProductCustomization(state => state.setSelected);
    const selected = useProductCustomization(state => state.selected);

    // Initialize selected options to first option for each type
    useEffect(() => {
        customizations.forEach(custom => {
            if (!selected[custom.type] && custom.options[0]) {
                setSelected(custom.type, custom.options[0]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customizations]);

    const handleSelect = (type: string, option: CustomizationOption) => {
        setSelected(type, option);
        if (onChange) onChange(type, option);
    };

    return (
        <Accordion.Root type="single" collapsible value={openType} onValueChange={setOpenType} className="rounded-2xl border-[0.5px] border-[#98A2B3] w-full max-w-md mx-auto">
            <div className="p-4 pb-0 text-base font-semibold">Customize your Wig</div>
            {customizations.map((custom) => (
                <Accordion.Item value={custom.type} key={custom.type} className="border-b border-gray-200">
                    <Accordion.Header>
                        <Accordion.Trigger className="flex w-full justify-between items-center px-4 py-3 text-left font-medium text-sm sm:text-base focus:outline-none">
                            <span>
                                {custom.type}
                                {selected[custom.type] && (
                                    <span className="ml-2 text-xs sm:text-sm text-gray-500 font-normal">
                                        (
                                        {selected[custom.type]?.label}
                                        {selected[custom.type]?.price ? ` - ₦${selected[custom.type]?.price?.toLocaleString()}` : ''}
                                        )
                                    </span>
                                )}
                            </span>
                            <svg className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="px-4 pb-4">
                        <div className="flex flex-col gap-2">
                            {custom.options.map((option) => {
                                const isSelected = selected[custom.type]?.label === option.label;
                                return (
                                    <button
                                        key={option.label}
                                        type="button"
                                        className={`flex justify-between items-center border rounded-lg px-3 py-2 text-sm sm:text-base w-full transition-colors
                      ${isSelected ? 'border-black bg-gray-100 font-semibold' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                                        onClick={() => handleSelect(custom.type, option)}
                                    >
                                        <span>{option.label}</span>
                                        {option.price ? <span className="text-gray-700 font-medium">₦{option.price.toLocaleString()}</span> : null}
                                    </button>
                                );
                            })}
                        </div>
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
};

export default ProductCustomization; 