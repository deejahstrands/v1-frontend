'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useAddress } from '@/store/use-address';
import { useToast } from '@/hooks/use-toast';
import type { Address } from '@/services/address';

interface AddressPreviewProps {
  onAddAddress: () => void;
  onEditAddress: (address: Address) => void;
}

export function AddressPreview({ onAddAddress, onEditAddress }: AddressPreviewProps) {
  const { addresses, selectedAddress, setSelectedAddress, deleteAddress, loading } = useAddress();
  const { toast } = useToast();

  const handleDeleteAddress = async (addressId: string) => {
    if (confirm(`Are you sure you want to delete this address?`)) {
      try {
        await deleteAddress(addressId);
        toast.success('Address deleted successfully');
      } catch {
        toast.error('Failed to delete address');
      }
    }
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.streetAddress,
      address.apartment,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddAddress}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No addresses found</p>
          <Button
            variant="primary"
            onClick={onAddAddress}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Address
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddAddress}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </Button>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAddress?.id === address.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedAddress(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedAddress?.id === address.id}
                      onChange={() => setSelectedAddress(address)}
                      className="text-primary"
                    />
                    {address.default && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-900 mb-1">
                  {formatAddress(address)}
                </div>
                
                <div className="text-sm text-gray-500">
                  Phone: {address.phoneNumber}
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAddress(address);
                  }}
                  className="p-2"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                {!address.default && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                    className="p-2 text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
