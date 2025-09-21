'use client';

import React, { useState } from 'react';
import { X, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { EditCartModal } from './edit-cart-modal';
import type { CartItem } from '@/store/use-cart';
import Image from 'next/image';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onEdit?: () => void; // Callback to refresh cart data after edit
}

export function CartItemCard({ item, onRemove, onIncrease, onDecrease, onEdit }: CartItemCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
  
  const handleDeleteConfirm = () => {
    onRemove();
    setShowDeleteModal(false);
  };

  
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
          <div className="space-y-2">
            <div>
              <span className="block text-sm font-medium mb-2">FRONT AND SIDE PICTURES OF YOUR HAIR LINE:</span>
              {item.measurements.hairlinePictures && item.measurements.hairlinePictures.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {item.measurements.hairlinePictures.map((picture, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <Image
                        src={typeof picture === 'string' ? picture : URL.createObjectURL(picture)}
                        alt={`Hairline picture ${index + 1}`}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded border hover:opacity-75 transition-opacity"
                        onClick={() => setSelectedImage(typeof picture === 'string' ? picture : URL.createObjectURL(picture))}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 text-sm">No images uploaded</span>
              )}
            </div>
            
            <div>
              <span className="block text-sm font-medium mb-2">HOW YOU WOULD LIKE THE WIG STYLED - PICTURE REFERENCE:</span>
              {item.measurements.styleReference && item.measurements.styleReference.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {item.measurements.styleReference.map((reference, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <Image
                        src={typeof reference === 'string' ? reference : URL.createObjectURL(reference)}
                        alt={`Style reference ${index + 1}`}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded border hover:opacity-75 transition-opacity"
                        onClick={() => setSelectedImage(typeof reference === 'string' ? reference : URL.createObjectURL(reference))}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 text-sm">No images uploaded</span>
              )}
            </div>
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
          <div className="flex justify-between items-center">
            <span className="flex-1">Base Price:</span>
            <span className="font-medium">{formatPrice(basePrice)}</span>
          </div>
          {customizationTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex-1">Customizations:</span>
              <span className="font-medium">{formatPrice(customizationTotal)}</span>
            </div>
          )}
          {deliveryTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex-1">Delivery:</span>
              <span className="font-medium">{formatPrice(deliveryTotal)}</span>
            </div>
          )}
          {consultationPrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex-1">Consultation:</span>
              <span className="font-medium">{formatPrice(consultationPrice)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white p-6 space-y-4">
        {/* Two-column layout: Image on left, details on right */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Left Column: Product Image */}
          <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
              <h3 className="font-semibold text-lg text-gray-900 flex-1 pr-2">
                {item.title}
              </h3>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer flex-shrink-0"
                title="Remove item from cart"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Options Button */}
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs cursor-pointer"
                onClick={() => setShowEditModal(true)}
              >
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
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                       
                        onDecrease();
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:text-gray-300 cursor-pointer"
                      disabled={item.quantity <= 1}
                    >
                      –
                    </button>
                    <div className="w-12 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                      {item.quantity}
                    </div>
                    <button
                      onClick={() => {
                        
                        onIncrease();
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="text-left sm:text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPrice(item.totalPrice)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.quantity > 1 && `${formatPrice(item.totalPrice / item.quantity)} each`}
                  </div>
                </div>
              </div>
            </div>

            {/* Item Total */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-medium text-gray-900 flex-1">TOTAL</span>
              <span className="font-semibold text-lg text-gray-900">
                {formatPrice(item.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        open={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        size="sm"
        className="p-6"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Remove Item from Cart
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to remove &ldquo;{item.title}&rdquo; from your cart? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Cart Modal */}
      {item.apiData?.cartItemId && (
        <EditCartModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          cartItemId={item.apiData.cartItemId}
          onSave={() => {
            if (onEdit) onEdit();
          }}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={selectedImage!}
              alt="Full size image"
              fill
              className="object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}