/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useAddress } from '@/store/use-address';
import { AddressForm } from '@/components/checkout/address-form';
import { toast } from 'react-toastify';
import type { Address } from '@/services/address';

export function AddressSection() {
  const { 
    addresses, 
    loading, 
    error, 
    fetchAddresses, 
    deleteAddress, 
    clearError 
  } = useAddress();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  // Fetch addresses on component mount only if not already loaded
  useEffect(() => {
    if (addresses.length === 0 && !loading) {
      fetchAddresses();
    }
  }, []); // Empty dependency array to run only once on mount

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleDeleteAddress = (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      setAddressToDelete(address);
      setIsDeleteModalOpen(true);
    } else {
      toast.error('Address not found');
    }
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      await deleteAddress(addressToDelete.id);
      toast.success('Address deleted successfully');
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (addressId: string) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      setEditingAddress(addressToEdit);
      setIsModalOpen(true);
    } else {
      toast.error('Address not found');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    // The AddressForm component will handle the success toast
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#C9A898] font-medium">Address</span>
        </nav>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <MapPin className="text-[#C9A898]" size={24} />
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Addresses</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your delivery addresses</p>
            </div>
          </div>
          <Button 
            onClick={handleAddAddress}
            disabled={loading}
            className="bg-[#C9A898] hover:bg-[#b88b6d] disabled:opacity-50 w-full sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            <span className="hidden sm:inline">Add New Address</span>
            <span className="sm:hidden">Add Address</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Addresses Content */}
      <div className="space-y-4">
        {loading ? (
          // Loading state - show multiple skeleton cards
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="animate-pulse">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <div className="h-8 bg-gray-200 rounded flex-1 sm:flex-none sm:w-16"></div>
                      <div className="h-8 bg-gray-200 rounded flex-1 sm:flex-none sm:w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : addresses.length > 0 ? (
          // Show addresses if user has any
          addresses.map((address) => {
            // Safety check for address object
            if (!address || !address.id) {
              return null;
            }
            
            return (
            <div key={address.id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    address?.default === true
                      ? 'bg-[#C9A898] text-white' 
                      : 'bg-[#C9A898] bg-opacity-50 text-gray-500'
                  }`}>
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {address?.default === true ? 'Default Address' : 'Address'}
                    </h3>
                    {address?.default === true && (
                      <p className="text-xs sm:text-sm text-gray-500">Default address</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditAddress(address.id)}
                    disabled={loading}
                    className="hover:bg-gray-50 flex-1 sm:flex-none"
                  >
                    <Edit3 size={16} className="mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} className="mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
              
              <div className="text-gray-700 space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-[#C9A898] rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{address.streetAddress}</p>
                    {address.apartment && (
                      <p className="text-gray-600 text-sm">Apt {address.apartment}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-600 text-sm sm:text-base break-words">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    {address.province && (
                      <p className="text-gray-600 text-sm break-words">{address.province}</p>
                    )}
                    <p className="text-gray-600 text-sm sm:text-base break-words">{address.country}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-600 font-medium text-sm sm:text-base break-words">{address.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
            );
          })
        ) : (
          // Show empty state if user has no addresses
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base px-4">Add your first address to make checkout faster.</p>
            <Button 
              onClick={handleAddAddress}
              disabled={loading}
              className="bg-[#C9A898] hover:bg-[#b88b6d] disabled:opacity-50 w-full sm:w-auto"
            >
              <Plus size={16} className="mr-2" />
              Add Address
            </Button>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        size="lg"
        className="max-w-2xl"
      >
        <AddressForm
          editingAddress={editingAddress}
          onCancel={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Address"
        message={`Are you sure you want to delete this address? This action cannot be undone.`}
        type="delete"
        confirmText="Delete Address"
        cancelText="Cancel"
        isLoading={loading}
      />
    </div>
  );
}
