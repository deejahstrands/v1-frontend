'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAddress } from '@/store/use-address';
import { useToast } from '@/hooks/use-toast';
import type { Address, AddAddressRequest } from '@/services/address';

interface AddressFormProps {
  editingAddress?: Address | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AddressForm({ editingAddress, onCancel, onSuccess }: AddressFormProps) {
  const { addAddress, updateAddress, loading } = useAddress();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AddAddressRequest>({
    country: '',
    province: '',
    streetAddress: '',
    state: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
    apartment: '',
    default: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill form when editing
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        country: editingAddress.country,
        province: editingAddress.province,
        streetAddress: editingAddress.streetAddress,
        state: editingAddress.state,
        city: editingAddress.city,
        postalCode: editingAddress.postalCode,
        phoneNumber: editingAddress.phoneNumber,
        apartment: editingAddress.apartment,
        default: editingAddress.default,
      });
    }
  }, [editingAddress]);

  const handleInputChange = (field: keyof AddAddressRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
        toast.success('Address updated successfully');
      } else {
        await addAddress(formData);
        toast.success('Address added successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Address form submission error:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingAddress ? 'Edit Address' : 'Add New Address'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            error={errors.country}
            placeholder="e.g., Nigeria"
            required
          />
          
          <Input
            label="State"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            error={errors.state}
            placeholder="e.g., Lagos"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            required
          />
          
          <Input
            label="Postal Code"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            error={errors.postalCode}
            required
          />
        </div>

        <Input
          label="Street Address"
          value={formData.streetAddress}
          onChange={(e) => handleInputChange('streetAddress', e.target.value)}
          error={errors.streetAddress}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Apartment, suite, etc. (Optional)"
            value={formData.apartment}
            onChange={(e) => handleInputChange('apartment', e.target.value)}
            error={errors.apartment}
          />
          
          <Input
            label="Province/Region (Optional)"
            value={formData.province}
            onChange={(e) => handleInputChange('province', e.target.value)}
            error={errors.province}
          />
        </div>

        <Input
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          error={errors.phoneNumber}
          required
        />

        <div className="flex items-center gap-2">
          <Checkbox
            id="default-address"
            checked={formData.default}
            onCheckedChange={(checked) => handleInputChange('default', checked)}
          />
          <label htmlFor="default-address" className="text-sm text-gray-700">
            Set as default address
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
          </Button>
        </div>
      </form>
    </div>
  );
}
