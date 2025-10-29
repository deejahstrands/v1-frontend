'use client'

import React, { useState } from 'react';

interface CustomizationOption {
  itemCustomizationId: string;
  label: string;
  name?: string;
  price?: number;
}
import { useProductCustomization } from '@/store/use-product-customization';
import { useDelivery } from '@/store/use-delivery';
import { useMeasurements } from '@/store/use-measurements';
import { useCart } from '@/store/use-cart';
import { useWishlist } from '@/store/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/use-auth';
import { useLoginModal } from '@/hooks/use-login-modal';
import { useCartPrice } from '@/lib/price-calculations';
import { uploadService } from '@/services/upload';
import { cartService } from '@/services/cart';
import { authService } from '@/services/auth';

interface AddToCartSectionProps {
  product: {
    id: string;
    price: string;
    title: string;
    image?: string;
    category?: string;
    specifications?: { type: string; value: string }[];
  };
}

const AddToCartSection: React.FC<AddToCartSectionProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedCustomizations = useProductCustomization(state => state.selected);
  const selectedDelivery = useDelivery(state => state.selected);
  const measurements = useMeasurements(state => state.data);
  const addToCart = useCart(state => state.addToCart);

  // Store reset functions
  const resetCustomization = useProductCustomization(state => state.reset);
  const resetDelivery = useDelivery(state => state.reset);
  const resetMeasurements = useMeasurements(state => state.reset);

  // Wishlist functionality
  const addToWishlist = useWishlist(state => state.addToWishlist);
  const removeFromWishlist = useWishlist(state => state.removeFromWishlist);
  const isInWishlist = useWishlist(state => state.isInWishlist);

  // Auth and login modal
  const { isAuthenticated } = useAuth();
  const { openModal } = useLoginModal();

  const { toast } = useToast();

  // Handle hydration
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Use shared price calculation
  const { basePrice, customizationTotal, totalPrice: singleTotal } = useCartPrice(product.price);
  const totalPrice = singleTotal * quantity;

  // Require both delivery selections before adding to cart
  const processingTimeId = selectedDelivery['Processing Time']?.productProcessingTimeId;
  const fittingOptionId = selectedDelivery['Private Fitting']?.productFittingOptionId;
  const isDeliveryComplete = Boolean(processingTimeId && fittingOptionId);

  const clearAllSelections = () => {
    resetCustomization();
    resetDelivery();
    resetMeasurements();
    setQuantity(1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prepareCartData = async () => {
    setIsUploading(true);
    try {
      // Validate required delivery selections
      if (!isDeliveryComplete) {
        throw new Error('delivery_incomplete');
      }
      // Upload images if measurements exist
      let measurementsData = undefined;
      if (measurements.hasMeasurements) {
        const hairlineFiles = measurements.hairlinePictures.filter((file): file is File => file instanceof File);
        const hairlineImages = hairlineFiles.length > 0
          ? await uploadService.uploadFiles(hairlineFiles)
          : [];

        const styleFiles = measurements.styleReference.filter((file): file is File => file instanceof File);
        const styleImages = styleFiles.length > 0
          ? await uploadService.uploadFiles(styleFiles)
          : [];

        measurementsData = {
          earToEar: measurements.earToEar,
          headCircumference: measurements.headCircumference,
          harlineImages: hairlineImages, // Note: API uses 'harlineImages' (typo in API)
          wigStyleImages: styleImages
        };
      }

      // Get customization IDs (filter out null values)
      const customizationIds = Object.values(selectedCustomizations)
        .filter(option => option !== null)
        .map(option => option!.itemCustomizationId)
        .filter(id => id !== undefined);

      // Get delivery IDs
      return {
        productId: product.id,
        quantity,
        ...(customizationIds.length > 0 && { customizations: customizationIds }),
        ...(measurementsData && { measurements: measurementsData }),
        ...(processingTimeId && { productProcessingTimeId: processingTimeId }),
        ...(fittingOptionId && { productFittingOptionId: fittingOptionId })
      };
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToCart = async () => {
    if (isUploading) return; // Prevent multiple clicks during upload

    // Enforce delivery requirements
    if (!isDeliveryComplete) {
      toast.info('Please select both Processing Time and Private Fitting to continue.');
      return;
    }

    // Check authentication first before any API calls
    if (!isAuthenticated) {
      openModal("Add Item to Cart", async () => {
        // This will be called after successful login
        try {
          // Double-check authentication before making API call
          if (!authService.isAuthenticated()) {
            throw new Error('Authentication required');
          }

          const apiData = await prepareCartData();
          // Call API to add to cart
          await cartService.addToCart(apiData);

          // Also add to local cart store for UI consistency
          addToCart({
            productId: product.id,
            title: product.title,
            image: product.image,
            basePrice,
            customizations: Object.fromEntries(
              Object.entries(selectedCustomizations).filter(([, option]) => option !== null)
            ) as { [type: string]: CustomizationOption },
            customizationTotal,
            totalPrice: singleTotal,
            quantity,
            delivery: selectedDelivery,
            measurements: measurements.hasMeasurements ? measurements : undefined,
            specifications: product.specifications,
            apiData,
          });

          toast.success(`${product.title} has been added to your cart.`);
          clearAllSelections();
          scrollToTop();
        } catch (error) {
          toast.error("Failed to add item to cart. Please try again.");
          console.error("API add to cart error:", error);
        }
      });
      return;
    }

    try {
      const apiData = await prepareCartData();
      // Call API to add to cart
      await cartService.addToCart(apiData);

      // Also add to local cart store for UI consistency
      addToCart({
        productId: product.id,
        title: product.title,
        image: product.image,
        basePrice,
        customizations: Object.fromEntries(
          Object.entries(selectedCustomizations).filter(([, option]) => option !== null)
        ) as { [type: string]: CustomizationOption },
        customizationTotal,
        totalPrice: singleTotal,
        quantity,
        delivery: selectedDelivery,
        measurements: measurements.hasMeasurements ? measurements : undefined,
        specifications: product.specifications,
        apiData,
      });

      toast.success(`${product.title} has been added to your cart.`);
      clearAllSelections();
      scrollToTop();
    } catch (error) {
      if (error instanceof Error && error.message === 'delivery_incomplete') {
        toast.info('Please select both Processing Time and Private Fitting to continue.');
      } else if (error instanceof Error && error.message.includes('upload')) {
        toast.error("Failed to upload images. Please try again.");
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
      console.error("Add to cart error:", error);
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      openModal("Add Item to Wishlist", () => {
        // This will be called after successful login
        addToWishlist({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
        });
        toast.success(`${product.title} has been added to your wishlist.`);
      });
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.title} has been removed from your wishlist.`);
    } else {
      addToWishlist({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      toast.success(`${product.title} has been added to your wishlist.`);
    }
  };

  return (
    <div className="mt-6 space-y-3 w-full max-w-md mx-auto">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4 my-4">
        <span className="font-medium text-lg">Quantity:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-2xl text-gray-400 hover:text-black disabled:text-gray-200 transition cursor-pointer"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            –
          </button>
          <div className="w-12 h-10 flex items-center justify-center text-lg font-semibold select-none border-x border-gray-100 bg-white">
            {quantity}
          </div>
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-2xl text-[#C9A18A] hover:text-[#a97c5e] transition cursor-pointer"
            onClick={() => setQuantity(q => q + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      {/* Add to Cart and Wishlist */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 bg-[#C9A18A] hover:bg-[#b88b6d] text-white font-semibold rounded-lg py-3 text-base transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={isUploading || !isDeliveryComplete}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-13z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="21" r="1" fill="currentColor" /><circle cx="19" cy="21" r="1" fill="currentColor" /></svg>
              {isDeliveryComplete ? `Add to Cart - ₦${totalPrice.toLocaleString()}` : 'Select delivery options to continue'}
            </>
          )}
        </button>
        {isHydrated && (
          <button
            type="button"
            className={`w-12 h-12 flex items-center justify-center border rounded-lg transition-colors cursor-pointer ${isInWishlist(product.id)
                ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                : 'bg-white text-black hover:bg-gray-100'
              }`}
            onClick={handleWishlistToggle}
            aria-label={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <svg
              width="24"
              height="24"
              fill={isInWishlist(product.id) ? "currentColor" : "none"}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21s-6.5-4.35-9-7.5C1.5 10.5 2.5 7 6 7c2.5 0 3.5 2 3.5 2s1-2 3.5-2c3.5 0 4.5 3.5 3 6.5-2.5 3.15-9 7.5-9 7.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {!isHydrated && (
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center border rounded-lg bg-white text-black hover:bg-gray-100 cursor-pointer"
            aria-label="Add to Wishlist"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21s-6.5-4.35-9-7.5C1.5 10.5 2.5 7 6 7c2.5 0 3.5 2 3.5 2s1-2 3.5-2c3.5 0 4.5 3.5 3 6.5-2.5 3.15-9 7.5-9 7.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      {/* Info / Helper */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#98A2B3" strokeWidth="2" /><path d="M12 8v4m0 4h.01" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Taxes included. shipping will be calculated and commutcated.
      </div>
      {!isDeliveryComplete && (
        <div className="text-xs text-red-600 mt-1">Please select both Processing Time and Private Fitting above to enable Add to Cart.</div>
      )}
    </div>
  );
};

export default AddToCartSection; 