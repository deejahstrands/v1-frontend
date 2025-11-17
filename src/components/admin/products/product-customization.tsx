"use client";

import React, { useState, useEffect } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { TypeCheckbox } from '@/components/admin/customization/type-checkbox';
import { PriceInput } from '@/components/ui/price-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/ui/pagination';
import { Settings } from 'lucide-react';
import { customizationTypeService, CustomizationType, CustomizationOption } from '@/services/admin/customization-type.service';


interface ProductCustomizationProps {
  customizationEnabled: boolean;
  selectedTypes: string[];
  selectedOptions: Array<{
    optionId: string;
    typeId: string;
    price: string;
  }>;
  openTypeId: string | null;
  onToggleCustomization: (checked: boolean) => void;
  onTypeChange: (typeId: string, checked: boolean) => void;
  onToggleTypeAccordion: (typeId: string) => void;
  onOptionChange: (optionId: string, typeId: string, checked: boolean) => void;
  onPriceChange: (optionId: string, price: string) => void;
}

export const ProductCustomization: React.FC<ProductCustomizationProps> = ({
  customizationEnabled,
  selectedTypes,
  selectedOptions,
  openTypeId,
  onToggleCustomization,
  onTypeChange,
  onToggleTypeAccordion,
  onOptionChange,
  onPriceChange
}) => {
  // State for API data
  const [customizationTypes, setCustomizationTypes] = useState<CustomizationType[]>([]);
  const [customizationOptions, setCustomizationOptions] = useState<Record<string, CustomizationOption[]>>({});
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState<Set<string>>(new Set());
  const [loadedTypes, setLoadedTypes] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  // Pagination state for each type (typeId -> page number)
  const [typePages, setTypePages] = useState<Record<string, number>>({});
  const OPTIONS_PER_PAGE = 5;

  // Load customization types on component mount
  useEffect(() => {
    const loadCustomizationTypes = async () => {
      try {
        setIsLoadingTypes(true);
        setError(null);
        const response = await customizationTypeService.getCustomizationTypes({
          status: 'active'
        });
        setCustomizationTypes(response.data);
      } catch (err) {
        console.error('Error loading customization types:', err);
        setError('Failed to load customization types');
      } finally {
        setIsLoadingTypes(false);
      }
    };

    if (customizationEnabled) {
      loadCustomizationTypes();
    }
  }, [customizationEnabled]);

  // Clean up pagination state when types are deselected
  useEffect(() => {
    setTypePages(prev => {
      const newPages = { ...prev };
      let changed = false;
      Object.keys(newPages).forEach(typeId => {
        if (!selectedTypes.includes(typeId)) {
          delete newPages[typeId];
          changed = true;
        }
      });
      return changed ? newPages : prev;
    });
  }, [selectedTypes]);

  // Load options for selected types
  useEffect(() => {
    const loadOptionsForTypes = async () => {
      if (selectedTypes.length === 0) {
        setCustomizationOptions({});
        setLoadingTypes(new Set());
        setLoadedTypes(new Set());
        return;
      }

      // Clean up loaded types that are no longer selected
      setLoadedTypes(prev => {
        const newSet = new Set(prev);
        prev.forEach(typeId => {
          if (!selectedTypes.includes(typeId)) {
            newSet.delete(typeId);
          }
        });
        return newSet;
      });

      // Find newly selected types that aren't already loaded or loading
      const newTypes = selectedTypes.filter(typeId =>
        !loadedTypes.has(typeId) && !loadingTypes.has(typeId)
      );

      if (newTypes.length === 0) {
        return;
      }

      // Add new types to loading state
      setLoadingTypes(prev => new Set([...prev, ...newTypes]));
      setError(null);

      try {
        // Load options for each new type
        const optionsPromises = newTypes.map(async (typeId) => {
          const response = await customizationTypeService.getCustomizationTypeWithOptions(typeId);
          return { typeId, options: response.data.options };
        });

        const typeOptionsResults = await Promise.all(optionsPromises);

        // Update options state - store options per type
        setCustomizationOptions(prev => {
          const newOptions = { ...prev };
          typeOptionsResults.forEach(({ typeId, options }) => {
            newOptions[typeId] = options;
          });
          return newOptions;
        });

        // Remove from loading state and add to loaded types
        setLoadingTypes(prev => {
          const newSet = new Set(prev);
          newTypes.forEach(typeId => newSet.delete(typeId));
          return newSet;
        });

        setLoadedTypes(prev => new Set([...prev, ...newTypes]));

      } catch (err) {
        console.error('Error loading customization options:', err);
        setError('Failed to load customization options');

        // Remove from loading state on error
        setLoadingTypes(prev => {
          const newSet = new Set(prev);
          newTypes.forEach(typeId => newSet.delete(typeId));
          return newSet;
        });
      }
    };

    if (customizationEnabled && selectedTypes.length > 0) {
      loadOptionsForTypes();
    }
  }, [customizationEnabled, selectedTypes, customizationTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get options for a specific customization type
  const getOptionsForType = (typeId: string) => {
    return customizationOptions[typeId]?.filter(opt => opt.status === 'active') || [];
  };

  // Get paginated options for a specific type
  const getPaginatedOptionsForType = (typeId: string) => {
    const allOptions = getOptionsForType(typeId);
    const currentPage = typePages[typeId] || 1;
    const startIndex = (currentPage - 1) * OPTIONS_PER_PAGE;
    const endIndex = startIndex + OPTIONS_PER_PAGE;
    return allOptions.slice(startIndex, endIndex);
  };

  // Get total pages for a specific type
  const getTotalPagesForType = (typeId: string) => {
    const allOptions = getOptionsForType(typeId);
    return Math.ceil(allOptions.length / OPTIONS_PER_PAGE);
  };

  // Handle page change for a specific type
  const handlePageChange = (typeId: string, page: number) => {
    setTypePages(prev => ({
      ...prev,
      [typeId]: page
    }));
  };

  // Check if a specific type is loading
  const isTypeLoading = (typeId: string) => {
    return loadingTypes.has(typeId);
  };

  // Check if a specific type has been loaded
  const isTypeLoaded = (typeId: string) => {
    return loadedTypes.has(typeId);
  };

  // Check if a customization option is selected
  const isOptionSelected = (optionId: string) => {
    return selectedOptions.some(opt => opt.optionId === optionId);
  };

  // Get price for a customization option
  const getOptionPrice = (optionId: string) => {
    const option = selectedOptions.find(opt => opt.optionId === optionId);
    return option?.price || '';
  };

  return (
    <div className="space-y-6">
      {/* Customization Toggle */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Product Customizations</h3>
            <p className="text-xs text-gray-500 mt-1">Select which customization types apply to this product</p>
          </div>
          <Toggle
            id="customization"
            checked={customizationEnabled}
            onCheckedChange={onToggleCustomization}
          />
        </div>
      </div>

      {/* Customization Types and Options */}
      {customizationEnabled && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Customization Types */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Available Customization Types
              </h4>
              {isLoadingTypes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading customization types...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customizationTypes.map((type) => (
                    <TypeCheckbox
                      key={type.id}
                      type={type}
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={(checked) => onTypeChange(type.id, checked)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Configure Options & Pricing */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                Configure Options & Pricing
              </h4>

              {selectedTypes.length === 0 ? (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Select customization types to configure options and pricing
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {selectedTypes.map((typeId) => {
                    const type = customizationTypes.find(t => t.id === typeId);
                    const allOptions = getOptionsForType(typeId);
                    const paginatedOptions = getPaginatedOptionsForType(typeId);
                    const totalPages = getTotalPagesForType(typeId);
                    const currentPage = typePages[typeId] || 1;

                    if (!type) return null;

                    return (
                      <div key={typeId} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Clickable Header */}
                        <button
                          onClick={() => onToggleTypeAccordion(typeId)}
                          className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                          <h5 className="text-md font-semibold text-gray-900">
                            {type.name}
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {allOptions.filter(opt => isOptionSelected(opt.id)).length} selected
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform ${openTypeId === typeId ? 'rotate-180' : ''
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
                          <div className="p-4">
                            {isTypeLoading(typeId) ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                                  </div>
                                  <div className="w-32 h-8 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-300 rounded w-20 mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-28 animate-pulse"></div>
                                  </div>
                                  <div className="w-32 h-8 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                              </div>
                            ) : isTypeLoaded(typeId) && allOptions.length === 0 ? (
                              <div className="text-center py-8">
                                <Settings className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 mb-2">
                                  No options available for this type
                                </p>
                                <p className="text-xs text-gray-400">
                                  This customization type has no active options
                                </p>
                              </div>
                            ) : isTypeLoaded(typeId) ? (
                              <>
                                <div className="space-y-3 mb-4">
                                  {paginatedOptions.map((option) => (
                                    <div key={option.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 border border-gray-100 rounded-lg">
                                      <div className="flex items-center gap-3 w-full sm:flex-1 min-w-0">
                                        <Checkbox
                                          id={option.id}
                                          checked={isOptionSelected(option.id)}
                                          onCheckedChange={(checked) =>
                                            onOptionChange(option.id, typeId, checked)
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
                                            onChange={(price) => onPriceChange(option.id, price)}
                                            placeholder="0"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <Pagination
                                      totalPages={totalPages}
                                      currentPage={currentPage}
                                      onPageChange={(page) => handlePageChange(typeId, page)}
                                    />
                                  </div>
                                )}
                              </>
                            ) : null}
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
      )}
    </div>
  );
};
