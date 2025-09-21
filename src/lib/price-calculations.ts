import { useProductCustomization } from '@/store/use-product-customization';
import { useDelivery } from '@/store/use-delivery';
import { useConsultation } from '@/store/use-consultation';

export interface PriceBreakdown {
  basePrice: number;
  customizationTotal: number;
  deliveryTotal: number;
  consultationPrice: number;
  totalPrice: number;
  hasCustomization: boolean;
}

export const usePriceCalculation = (productPrice: string, includeConsultation: boolean = false): PriceBreakdown => {
  const customizationTotal = useProductCustomization(state => state.getTotalPrice());
  const deliveryTotal = useDelivery(state => state.getTotalPrice());
  const selectedConsultation = useConsultation(state => state.selectedConsultation);
  const consultation = selectedConsultation ? {
    type: selectedConsultation.name,
    price: selectedConsultation.price
  } : undefined;
  
  const basePrice = Number(productPrice.replace(/[^0-9.-]+/g, ""));
  const consultationPrice = includeConsultation ? Number(consultation?.price || 0) : 0;
  const totalPrice = basePrice + customizationTotal + deliveryTotal + consultationPrice;
  const hasCustomization = customizationTotal > 0;

  return {
    basePrice,
    customizationTotal,
    deliveryTotal,
    consultationPrice,
    totalPrice,
    hasCustomization,
  };
};

// For product detail page (without consultation)
export const useProductDetailPrice = (productPrice: string) => {
  return usePriceCalculation(productPrice, false);
};

// For cart operations (with consultation)
export const useCartPrice = (productPrice: string) => {
  return usePriceCalculation(productPrice, true);
}; 