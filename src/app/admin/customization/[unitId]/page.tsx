/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/common/button';
import { TypeCheckbox } from '@/components/admin/customization/type-checkbox';
import { PriceInput } from '@/components/ui/price-input';
import { Checkbox } from '@/components/ui/checkbox';
import { useWigUnitManagement } from '@/hooks/admin/use-wig-unit-management';
import { customizationTypeService, CustomizationType, CustomizationOption } from '@/services/admin/customization-type.service';

interface SelectedOption {
    optionId: string;
    typeId: string;
    price: string;
}

export default function WigCustomizationPage() {
    const params = useParams();
    const router = useRouter();
    const unitId = params.unitId as string;

    // Use the wig unit management hook
    const {
        currentWigUnit: wigUnit,
        isLoading: isLoadingUnit,
        updateWigUnit,
        getWigUnit,
    } = useWigUnitManagement();

    // State for customization types and options
    const [customizationTypes, setCustomizationTypes] = useState<CustomizationType[]>([]);
    const [customizationOptions, setCustomizationOptions] = useState<CustomizationOption[]>([]);
    const [isLoadingCustomizationTypes, setIsLoadingCustomizationTypes] = useState(false);
    const [, setIsLoadingCustomizationOptions] = useState(false);

    // State
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openTypeId, setOpenTypeId] = useState<string | null>(null);

    // Ref to prevent multiple calls
    const loadedUnitId = useRef<string | null>(null);
    const loadedOptions = useRef<Set<string>>(new Set());
    const loadedTypes = useRef<boolean>(false);

    // Load wig unit data
    useEffect(() => {
        if (unitId && loadedUnitId.current !== unitId) {
            loadedUnitId.current = unitId;
            getWigUnit(unitId);
        }
    }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Load customization types
    useEffect(() => {
        const loadCustomizationTypes = async () => {
            if (loadedTypes.current) return;
            
            setIsLoadingCustomizationTypes(true);
            try {
                const response = await customizationTypeService.getCustomizationTypes();
                setCustomizationTypes(response.data);
                loadedTypes.current = true;
            } catch (error) {
                console.error('Error loading customization types:', error);
            } finally {
                setIsLoadingCustomizationTypes(false);
            }
        };

        loadCustomizationTypes();
    }, []);

    // Load customization options when types are selected
    useEffect(() => {
        const loadCustomizationOptions = async () => {
            if (selectedTypes.length === 0) return;

            // Check if we've already loaded options for these types
            const typesKey = selectedTypes.sort().join(',');
            if (loadedOptions.current.has(typesKey)) return;

            setIsLoadingCustomizationOptions(true);
            try {
                const allOptions: CustomizationOption[] = [];
                
                for (const typeId of selectedTypes) {
                    const response = await customizationTypeService.getCustomizationTypeWithOptions(typeId);
                    if (response.data.options) {
                        // Add typeId to each option so we can filter by type later
                        const optionsWithTypeId = response.data.options.map(option => ({
                            ...option,
                            typeId: typeId
                        }));
                        allOptions.push(...optionsWithTypeId);
                    }
                }
                
                setCustomizationOptions(allOptions);
                loadedOptions.current.add(typesKey);
            } catch (error) {
                console.error('Error loading customization options:', error);
            } finally {
                setIsLoadingCustomizationOptions(false);
            }
        };

        loadCustomizationOptions();
    }, [selectedTypes]);

    // Auto-fill existing customizations when wig unit is loaded
    useEffect(() => {
        if (wigUnit && wigUnit.customizations) {
            const existingTypes: string[] = [];
            const existingOptions: SelectedOption[] = [];

            wigUnit.customizations.forEach((customization: any) => {
                if (customization.options && customization.options.length > 0) {
                    // Find the type ID for this customization
                    const type = customizationTypes.find(t => t.name === customization.typeName);
                    if (type) {
                        existingTypes.push(type.id);
                        
                        // Add the options
                        customization.options.forEach((option: any) => {
                            existingOptions.push({
                                optionId: option.customizationId,
                                typeId: type.id,
                                price: option.price.toString()
                            });
                        });
                    }
                }
            });

            setSelectedTypes(existingTypes);
            setSelectedOptions(existingOptions);
        }
    }, [wigUnit, customizationTypes]);

      // Handle type selection
  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, typeId]);
      // Clear options for this type if it was previously selected
      setSelectedOptions(prev => prev.filter(opt => opt.typeId !== typeId));
      // Open this type (accordion behavior)
      setOpenTypeId(typeId);
    } else {
      setSelectedTypes(prev => prev.filter(id => id !== typeId));
      // Clear options for this type
      setSelectedOptions(prev => prev.filter(opt => opt.typeId !== typeId));
      // Close this type if it was open
      if (openTypeId === typeId) {
        setOpenTypeId(null);
      }
    }
  };

  // Handle accordion toggle
  const toggleTypeAccordion = (typeId: string) => {
    if (openTypeId === typeId) {
      setOpenTypeId(null);
    } else {
      setOpenTypeId(typeId);
    }
  };

    // Handle option selection
    const handleOptionChange = (optionId: string, typeId: string, checked: boolean) => {
        if (checked) {
            setSelectedOptions(prev => [...prev, { optionId, typeId, price: '' }]);
        } else {
            setSelectedOptions(prev => prev.filter(opt => opt.optionId !== optionId));
        }
    };

      // Handle price change
  const handlePriceChange = (optionId: string, price: string) => {
    setSelectedOptions(prev => 
      prev.map(opt => 
        opt.optionId === optionId ? { ...opt, price } : opt
      )
    );
  };

  // Get numeric price value (remove commas for calculations)
  const getNumericPrice = (price: string): number => {
    return parseInt(price.replace(/,/g, '')) || 0;
  };

    // Get options for a specific type
    const getOptionsForType = (typeId: string) => {
        return customizationOptions.filter(opt =>
            opt.status === 'active' && (opt as any).typeId === typeId
        );
    };

    // Check if an option is selected
    const isOptionSelected = (optionId: string) => {
        return selectedOptions.some(opt => opt.optionId === optionId);
    };

    // Get price for an option
    const getOptionPrice = (optionId: string) => {
        const option = selectedOptions.find(opt => opt.optionId === optionId);
        return option?.price || '';
    };

    // Handle save
    const handleSave = async () => {
        if (!wigUnit) return;
        
        setIsLoading(true);
        try {
            // Transform selected options to the format expected by the API
            const customizations = selectedOptions.map(opt => ({
                customizationId: opt.optionId,
                price: getNumericPrice(opt.price)
            }));

            await updateWigUnit(wigUnit.id, {
                customizations
            });

            // Redirect to customization page
            router.push('/admin/customization');
        } catch (error) {
            console.error('Error saving customization:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle go back
    const handleGoBack = () => {
        router.push('/admin/customization');
    };

    if (isLoadingUnit || !wigUnit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto max-w-7xl px-4 py-6">
            {/* Breadcrumb and Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="tertiary"
                        onClick={handleGoBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Wig Customization</span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{wigUnit.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{wigUnit.name}</h1>
                        <p className="text-gray-600 mt-1">
                            Select which customization types apply to this product
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Available Customization Types */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Available Customization Types
                        </h2>
                        <div className="space-y-3">
                            {isLoadingCustomizationTypes ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                customizationTypes.map((type) => (
                                    <TypeCheckbox
                                        key={type.id}
                                        type={type}
                                        checked={selectedTypes.includes(type.id)}
                                        onCheckedChange={(checked) => handleTypeChange(type.id, checked)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Configure Options & Pricing */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Configure Options & Pricing
                        </h2>

                        {selectedTypes.length === 0 ? (
                            <div className="text-center py-12">
                                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    Select customization types to configure options and pricing
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {selectedTypes.map((typeId) => {
                                    const type = customizationTypes.find(t => t.id === typeId);
                                    const options = getOptionsForType(typeId);

                                    if (!type) return null;

                                                                         return (
                                       <div key={typeId} className="border border-gray-200 rounded-lg overflow-hidden">
                                         {/* Clickable Header */}
                                         <button
                                           onClick={() => toggleTypeAccordion(typeId)}
                                           className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                                         >
                                           <h3 className="text-md font-semibold text-gray-900">
                                             {type.name}
                                           </h3>
                                           <div className="flex items-center gap-2">
                                             <span className="text-sm text-gray-500">
                                               {options.filter(opt => isOptionSelected(opt.id)).length} selected
                                             </span>
                                             <svg
                                               className={`w-5 h-5 text-gray-500 transition-transform ${
                                                 openTypeId === typeId ? 'rotate-180' : ''
                                               }`}
                                               fill="none"
                                               stroke="currentColor"
                                               viewBox="0 0 24 24"
                                             >
                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                             </svg>
                                           </div>
                                         </button>
                                         
                                         {/* Collapsible Content */}
                                         {openTypeId === typeId && (
                                           <div className="p-4 space-y-3">
                                             {options.map((option) => (
                                               <div key={option.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 border border-gray-100 rounded-lg">
                                                 <div className="flex items-center gap-3 w-full sm:flex-1 min-w-0">
                                                   <Checkbox
                                                     id={option.id}
                                                     checked={isOptionSelected(option.id)}
                                                     onCheckedChange={(checked) =>
                                                       handleOptionChange(option.id, typeId, checked)
                                                     }
                                                     className="data-[state=checked]:bg-black data-[state=checked]:border-black flex-shrink-0"
                                                   />
                                                   
                                                   <div className="flex-1 min-w-0">
                                                     <label
                                                       htmlFor={option.id}
                                                       className="text-sm font-medium text-gray-900 cursor-pointer"
                                                     >
                                                       {option.name}
                                                     </label>
                                                     {option.description && (
                                                       <p className="text-xs text-gray-500 mt-1">
                                                         {option.description}
                                                       </p>
                                                     )}
                                                   </div>
                                                 </div>
                                                 
                                                 {isOptionSelected(option.id) && (
                                                   <div className="w-full sm:w-40 mt-3 sm:mt-0 flex-shrink-0">
                                                     <PriceInput
                                                       value={getOptionPrice(option.id)}
                                                       onChange={(price) => handlePriceChange(option.id, price)}
                                                       placeholder="0"
                                                     />
                                                   </div>
                                                 )}
                                               </div>
                                             ))}
                                           </div>
                                         )}
                                       </div>
                                     );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-4">
                <Button
                    variant="tertiary"
                    onClick={handleGoBack}
                    className="px-6"
                >
                    Cancel
                </Button>
                         <Button
           onClick={handleSave}
           disabled={isLoading || selectedTypes.length === 0 || selectedOptions.length === 0}
           className="px-6"
         >
           {isLoading ? 'Saving...' : 'Save Customization'}
         </Button>
            </div>
        </div>
    );
}
