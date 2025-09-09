"use client";

import React from 'react';
import { MoreVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AdminProduct } from '@/services/admin';
import Image from 'next/image'

interface ProductCardProps {
  product: AdminProduct;
  onView: (product: AdminProduct) => void;
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
  onAddToCollection: (product: AdminProduct) => void;
  onChangeStatus: (product: AdminProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
  onAddToCollection,
  onChangeStatus,
}) => {
  const getStatusColor = (status: string) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image and Status */}
      <div className="relative">
        <Image
          src={product.thumbnail}
          alt={product.name}
          width={100}
          height={100}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.visibility)}`}>
          {product.visibility === 'published' ? 'Published' : 'Hidden'}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>

        <div className="text-lg font-bold text-gray-900 mb-2">
          ₩{product.basePrice.toLocaleString()}
        </div>


        <div className="text-sm text-gray-600 mb-4">
          Customization: {product.customization ? 'Yes' : 'No'}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(product)}
            className="flex-1 mr-2"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(product)}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddToCollection(product)}>
                Add to Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeStatus(product)}>
                Change Product Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
