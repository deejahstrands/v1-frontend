'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { cartService } from '@/services/cart';
import { useToast } from '@/hooks/use-toast';

// Import product detail components
import ProductCustomization from '@/components/products/product-details/ProductCustomization';
import ProductDeliveryAccordion from '@/components/products/product-details/ProductDeliveryAccordion';
import { MeasurementsAndPreferences } from '@/components/products/product-details/MeasurementsAndPreferences';

// Import stores
import { useProductCustomization } from '@/store/use-product-customization';
import { useDelivery } from '@/store/use-delivery';
import { useMeasurements } from '@/store/use-measurements';

interface EditCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemId: string;
  onSave: () => void;
}

interface CartItemData {
  id: string;
  measurements?: {
    earToEar?: string;
    headCircumference?: string;
    harlineImages?: string[];
    wigStyleImages?: string[];
  };
  privateFitting?: {
    productFittingOptionId: string;
    fittingOptionId: string;
    name: string;
    price: number;
  };
  processingTime?: {
    productProcessingTimeId: string;
    processingTimeId: string;
    label: string;
    price: number;
  };
  product?: {
    id: string;
    name: string;
    basePrice: number;
    thumbnail?: string;
  };
  wigUnit?: {
    id: string;
    name: string;
    basePrice: number;
    thumbnail?: string;
  };
  customizations: Array<{
    typeName: string;
    description: string;
    options: Array<{
      itemCustomizationId: string;
      customizationId: string;
      name: string;
      description: string;
      price: number;
      status: string;
    }>;
  }>;
  quantity: number;
  totalPrice: number;
}

export function EditCartModal({ isOpen, onClose, cartItemId, onSave }: EditCartModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItem, setCartItem] = useState<CartItemData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const fetchingRef = useRef(false);

  // Store functions
  const setSelectedCustomization = useProductCustomization((state) => state.setSelected);
  const resetCustomization = useProductCustomization((state) => state.reset);
  const selectedCustomizations = useProductCustomization((state) => state.selected);
  
  const setSelectedDelivery = useDelivery((state) => state.setSelected);
  const resetDelivery = useDelivery((state) => state.reset);
  const selectedDelivery = useDelivery((state) => state.selected);
  
  const setMeasurementData = useMeasurements((state) => state.setData);
  const resetMeasurements = useMeasurements((state) => state.reset);
  const measurements = useMeasurements((state) => state.data);

  const { toast } = useToast();

  const fetchCartItem = useCallback(async () => {
    if (fetchingRef.current) return; // Prevent multiple calls
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartService.getCartItem(cartItemId);
      const item = response.data;
      setCartItem(item);
      setQuantity(item.quantity);

      // Prefill customizations
      if (item.customizations && item.customizations.length > 0) {
        item.customizations.forEach(customization => {
          // Find the selected option for each customization type
          const selectedOption = customization.options[0];
          if (selectedOption) {
            setSelectedCustomization(customization.typeName, {
              itemCustomizationId: selectedOption.itemCustomizationId,
              customizationId: selectedOption.customizationId,
              name: selectedOption.name,
              label: selectedOption.name,
              description: selectedOption.description,
              price: selectedOption.price,
              status: selectedOption.status,
            });
          }
        });
      }

      // Prefill delivery options
      if (item.privateFitting) {
        setSelectedDelivery('Private Fitting', {
          label: item.privateFitting.name,
          price: item.privateFitting.price,
          productFittingOptionId: item.privateFitting.productFittingOptionId,
        });
      }

      if (item.processingTime) {
        setSelectedDelivery('Processing Time', {
          label: item.processingTime.label,
          price: item.processingTime.price,
          productProcessingTimeId: item.processingTime.productProcessingTimeId,
        });
      }

      // Prefill measurements
      if (item.measurements) {
        setMeasurementData({
          hasMeasurements: 'yes',
          earToEar: item.measurements.earToEar || '',
          headCircumference: item.measurements.headCircumference || '',
          foreheadToNape: '',
          hairlinePictures: item.measurements.harlineImages || [],
          styleReference: item.measurements.wigStyleImages || [],
        });
      }

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to fetch cart item');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [cartItemId, setMeasurementData, setSelectedCustomization, setSelectedDelivery]);

  // Fetch cart item data when modal opens
  useEffect(() => {
    if (isOpen && cartItemId) {
      fetchCartItem();
    }
  }, [isOpen, cartItemId, fetchCartItem]);

  // Reset stores when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetCustomization();
      resetDelivery();
      resetMeasurements();
      setCartItem(null);
      setError(null);
      fetchingRef.current = false; // Reset fetch state
    }
  }, [isOpen, resetCustomization, resetDelivery, resetMeasurements]);

  const handleSave = async () => {
    if (!cartItem) return;

    setSaving(true);
    try {
      // Prepare update data
      const updateData: Record<string, unknown> = {
        quantity,
      };

      // Add customizations if any selected
      const customizationIds = Object.values(selectedCustomizations)
        .filter(option => option !== null)
        .map(option => option!.itemCustomizationId)
        .filter(id => id !== undefined);

      if (customizationIds.length > 0) {
        updateData.customizations = customizationIds;
      }

      // Add delivery options
      if (selectedDelivery['Processing Time']?.productProcessingTimeId) {
        updateData.productProcessingTimeId = selectedDelivery['Processing Time'].productProcessingTimeId;
      }

      if (selectedDelivery['Private Fitting']?.productFittingOptionId) {
        updateData.productFittingOptionId = selectedDelivery['Private Fitting'].productFittingOptionId;
      }

      // Add measurements if provided
      if (measurements.hasMeasurements === 'yes') {
        updateData.measurements = {
          earToEar: measurements.earToEar,
          headCircumference: measurements.headCircumference,
          harlineImages: measurements.hairlinePictures,
          wigStyleImages: measurements.styleReference,
        };
      }

      // Update cart item
      await cartService.updateCartItem(cartItemId, updateData);
      
      toast.success('Cart item updated successfully');
      onSave(); // Refresh cart data
      onClose();
    } catch (error: unknown) {
      toast.error('Failed to update cart item: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const transformCustomizations = () => {
    if (!cartItem?.customizations) return [];

    return cartItem.customizations.map(customization => ({
      type: customization.typeName,
      typeName: customization.typeName,
      description: customization.description,
      options: customization.options.map(option => ({
        ...option,
        label: option.name,
      })),
    }));
  };

  const transformDeliveryOptions = () => {
    const delivery: Array<{ type: string; options: Array<{ label: string; price: number; }> }> = [];

    if (cartItem?.processingTime) {
      delivery.push({
        type: 'Processing Time',
        options: [
          { label: 'None', price: 0 },
          { label: cartItem.processingTime.label, price: cartItem.processingTime.price },
        ],
      });
    }

    if (cartItem?.privateFitting) {
      delivery.push({
        type: 'Private Fitting',
        options: [
          { label: 'None', price: 0 },
          { label: cartItem.privateFitting.name, price: cartItem.privateFitting.price },
        ],
      });
    }

    return delivery;
  };

  const productName = cartItem?.product?.name || cartItem?.wigUnit?.name || 'Product';

  return (
    <Modal open={isOpen} onClose={onClose} size="lg" className="max-w-2xl">
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Edit Cart Item</h2>
          <p className="text-sm text-gray-500 mt-1">Update your selections for {productName}</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">Loading cart item details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Item</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchCartItem} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : cartItem ? (
            <>
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-2xl text-gray-400 hover:text-black disabled:text-gray-200 transition cursor-pointer"
                    >
                      –
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center text-lg font-semibold select-none border-x border-gray-100 bg-white">
                      {quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-2xl text-[#C9A18A] hover:text-[#a97c5e] transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Customizations */}
              {transformCustomizations().length > 0 && (
                <div>
                  <ProductCustomization 
                    customizations={transformCustomizations()}
                  />
                </div>
              )}

              {/* Measurements */}
              {cartItem.measurements && (
                <div>
                  <MeasurementsAndPreferences />
                </div>
              )}

              {/* Delivery Options */}
              {transformDeliveryOptions().length > 0 && (
                <div>
                  <ProductDeliveryAccordion 
                    delivery={transformDeliveryOptions()}
                  />
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-1"
            disabled={saving || loading || !cartItem}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
