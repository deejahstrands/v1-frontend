import React from 'react';
import Image from 'next/image';
import { useProducts } from '@/store/use-products';
import { CartItem } from '@/store/use-cart';
import { Minus, Plus, X, Pencil } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove, onIncrease, onDecrease }) => {
  const product = useProducts(state => state.getProductById(item.productId));
  if (!product) return null;

  return (
    <div className="flex gap-4 items-start bg-white rounded-xl p-4 shadow-sm relative">
      {/* Remove button */}
      <button onClick={onRemove} className="absolute left-2 top-2 text-gray-400 hover:text-red-500">
        <X size={24} />
      </button>
      {/* Product image */}
      <div className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image src={product.thumbnail} alt={product.name} width={80} height={96} className="object-cover w-full h-full" />
      </div>
      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-base md:text-lg">{product.name}</span>
          <button className="border border-gray-300 rounded p-1 text-gray-500 cursor-not-allowed" disabled>
            <Pencil size={16} />
          </button>
        </div>
        {/* Customizations and options */}
        <div className="text-xs text-gray-500 leading-snug mb-2">
          {Object.entries(item.customizations).map(([type, opt]) => (
            <div key={type}>
              <span className="uppercase font-medium">{type}:</span> {opt.label}{opt.price ? ` (+₦${opt.price.toLocaleString()})` : ''}
            </div>
          ))}
          {item.delivery && Object.entries(item.delivery).map(([type, opt]) => (
            <div key={type}>
              <span className="uppercase font-medium">{type}:</span> {opt.label}{opt.price ? ` (+₦${opt.price.toLocaleString()})` : ''}
            </div>
          ))}
          {item.consultation && (
            <div>
              <span className="uppercase font-medium">Consultation:</span> {item.consultation.type} (+₦{item.consultation.price.toLocaleString()})
            </div>
          )}
        </div>
        {/* Quantity and price */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button onClick={onDecrease} className="px-2 py-1 text-lg disabled:opacity-50" disabled={item.quantity <= 1}>
              <Minus size={18} />
            </button>
            <span className="px-3 text-base font-medium">{item.quantity}</span>
            <button onClick={onIncrease} className="px-2 py-1 text-lg">
              <Plus size={18} />
            </button>
          </div>
          <div className="text-lg md:text-xl font-semibold ml-2 whitespace-nowrap">
            ₦{item.totalPrice.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard; 