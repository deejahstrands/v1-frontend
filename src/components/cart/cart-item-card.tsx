'use client';

import React from 'react';
import { X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/store/use-cart';
import Image from 'next/image';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function CartItemCard({ item, onRemove, onIncrease, onDecrease }: CartItemCardProps) {
  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
  
  // Debug: Log cart item data to check images
  console.log('Cart Item Data:', item);
  
  const renderCustomizations = () => {
    const customizations = Object.entries(item.customizations);
    if (customizations.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">CUSTOMIZATIONS:</div>
        <div className="space-y-1">
          {customizations.map(([type, option]) => (
            <div key={type} className="text-sm text-gray-600">
              {type}: {option.label} {option.price ? `- ${formatPrice(option.price)}` : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSpecifications = () => {
    // Debug: Log specifications data
    console.log('Specifications check:', {
      hasCustomizations: Object.keys(item.customizations).length > 0,
      customizations: item.customizations,
      specifications: item.specifications,
      specificationsLength: item.specifications?.length
    });
    
    // Only show specifications if there are no customizations
    if (Object.keys(item.customizations).length > 0) return null;
    
    // Show specifications if available in cart item
    if (!item.specifications || item.specifications.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">SPECIFICATIONS:</div>
        <div className="space-y-1 text-sm text-gray-600">
          {item.specifications.map((spec, index) => (
            <div key={index}>{spec.type}: {spec.value}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderDelivery = () => {
    if (!item.delivery || Object.keys(item.delivery).length === 0) return null;
    
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">DELIVERY OPTIONS:</div>
        <div className="space-y-1">
          {Object.entries(item.delivery).map(([type, option]) => (
            <div key={type} className="text-sm text-gray-600">
              {type}: {option.label} {option.price > 0 ? `- ${formatPrice(option.price)}` : ''}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMeasurements = () => {
    // Only show measurements if product has customizations and measurements are provided
    if (!item.customizations || Object.keys(item.customizations).length === 0) return null;
    if (!item.measurements || item.measurements.hasMeasurements !== 'yes') return null;
    
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">MEASUREMENTS: (YES)</div>
        <div className="space-y-1 text-sm text-gray-600">
          <div>HEAD MEASUREMENT - EAR TO EAR: {item.measurements.earToEar}&rdquo;</div>
          <div>HEAD MEASUREMENT - HEAD CIRCUMFERENCE: {item.measurements.headCircumference}&quot;</div>
          <div>HEAD MEASUREMENT - FOREHEAD TO NAPE: {item.measurements.foreheadToNape || 'N/A'}&quot;</div>
          <div className="flex items-center gap-2">
            <span>FRONT AND SIDE PICTURES OF YOUR HAIR LINE:</span>
            {item.measurements.hairlinePictures && (
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs">IMG</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>HOW YOU WOULD LIKE THE WIG STYLED - PICTURE REFERENCE:</span>
            {item.measurements.styleReference && (
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs">IMG</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConsultation = () => {
    if (!item.consultation) return null;
    
    return (
      <div className="space-y-1">
        <div className="text-sm text-gray-600">
          Consultation: {item.consultation.type} - {formatPrice(item.consultation.price)}
        </div>
        {item.consultation.description && (
          <div className="text-sm text-gray-500 italic">
            &ldquo;{item.consultation.description}&rdquo;
          </div>
        )}
      </div>
    );
  };

  const renderPriceBreakdown = () => {
    const basePrice = item.basePrice;
    const customizationTotal = item.customizationTotal || 0;
    const deliveryTotal = item.delivery ? Object.values(item.delivery).reduce((sum, option) => sum + option.price, 0) : 0;
    const consultationPrice = item.consultation?.price || 0;

    return (
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <div className="text-sm font-medium text-gray-700">PRICE BREAKDOWN:</div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Base Price:</span>
            <span>{formatPrice(basePrice)}</span>
          </div>
          {customizationTotal > 0 && (
            <div className="flex justify-between">
              <span>Customizations:</span>
              <span>{formatPrice(customizationTotal)}</span>
            </div>
          )}
          {deliveryTotal > 0 && (
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>{formatPrice(deliveryTotal)}</span>
            </div>
          )}
          {consultationPrice > 0 && (
            <div className="flex justify-between">
              <span>Consultation:</span>
              <span>{formatPrice(consultationPrice)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 space-y-4">
      {/* Two-column layout: Image on left, details on right */}
      <div className="flex gap-6">
        {/* Left Column: Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {item.image ? (
            <Image
              src={item.image}
              width={96}
              height={96}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">IMG</span>
            </div>
          )}
        </div>
        
        {/* Right Column: Product Details */}
        <div className="flex-1 min-w-0">
          {/* Header with title and close button */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-900">
              {item.title}
            </h3>
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Edit Options Button */}
          <div className="mb-4">
            <Button variant="outline" size="sm" className="text-xs">
              <Edit className="w-3 h-3 mr-1" />
              Edit Options
            </Button>
          </div>

          {/* Customizations */}
          {renderCustomizations()}

          {/* Specifications */}
          {renderSpecifications()}

          {/* Delivery Options */}
          {renderDelivery()}

          {/* Measurements */}
          {renderMeasurements()}

          {/* Consultation */}
          {renderConsultation()}

          {/* Additional Info - Only show if no delivery options selected */}
          {(!item.delivery || Object.keys(item.delivery).length === 0) && (
            <div className="space-y-1 text-sm text-gray-600">
              <div>PRIVATE FITTING: DEEJAH STRAND STUDIO, LAGOS</div>
              <div>PROCESSING TIME: 10 - 14 WORKING DAYS</div>
            </div>
          )}

          {/* Price Breakdown */}
          {renderPriceBreakdown()}

          {/* Quantity and Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => {
                    console.log('=== DECREASE BUTTON CLICKED ===');
                    console.log('Current item:', {
                      productId: item.productId,
                      quantity: item.quantity,
                      title: item.title
                    });
                    onDecrease();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  disabled={item.quantity <= 1}
                >
                  –
                </button>
                <div className="w-12 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                  {item.quantity}
                </div>
                <button
                  onClick={() => {
                    console.log('=== INCREASE BUTTON CLICKED ===');
                    console.log('Current item:', {
                      productId: item.productId,
                      quantity: item.quantity,
                      title: item.title
                    });
                    onIncrease();
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(item.totalPrice)}
              </div>
              <div className="text-sm text-gray-500">
                {item.quantity > 1 && `${formatPrice(item.totalPrice / item.quantity)} each`}
              </div>
            </div>
          </div>

          {/* Item Total */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="font-medium text-gray-900">TOTAL</span>
            <span className="font-semibold text-lg text-gray-900">
              {formatPrice(item.totalPrice * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 