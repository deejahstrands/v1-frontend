import React from "react";
import StarRating from "./StarRating";
import Status from "./Status";
import { useProductDetailPrice } from '@/lib/price-calculations';

interface Specification {
  type: string;
  value: string;
}

interface ProductInfoPanelProps {
  product: {
    id: string;
    title: string;
    rating?: number;
    reviewCount?: number;
    price: string;
    inStock?: boolean;
    quantity?: number;
    status?: string;
    specifications?: Specification[];
  };
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const { basePrice, totalPrice, hasCustomization } = useProductDetailPrice(product.price);

  return (
    <div className="rounded-lg p-4 sm:p-6 space-y-4">
      {/* Product Name + Status */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-xl sm:text-2xl font-bold">{product.title}</h1>
        {product.status === 'sold_out' && (
          <span className="inline-block bg-red-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md uppercase tracking-wide">Sold Out</span>
        )}
      </div>
      {/* Star Rating and Reviews */}
      <div className="flex items-center gap-2 my-2">
        <StarRating rating={product.rating || 0} size={20} />
        <span className="text-gray-700 font-medium text-base">{(product.rating || 0).toFixed(1)}</span>
        <span className="text-gray-500 text-sm">({product.reviewCount || 0} Reviews)</span>
      </div>
      {/* Price */}
      {hasCustomization && (
        <div className="text-xs text-gray-500">Base: ₦{basePrice.toLocaleString()}</div>
      )}
      <div className="text-2xl font-bold mb-1">₦{totalPrice.toLocaleString()}</div>
      {/* Stock Status */}
      <Status inStock={product.inStock ?? true} quantity={product.quantity} />
      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="mt-4">
          <div className="font-medium mb-2">Model is wearing:</div>
          <ul className="list-disc pl-5 space-y-1">
            {product.specifications.map((spec, idx) => (
              <li key={idx} className="text-sm"><span className="font-semibold">{spec.type}:</span> {spec.value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductInfoPanel; 