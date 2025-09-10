/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/button';
import { Select } from '@/components/ui/select';
import { ArrowLeft, User, Mail, Phone, Package, AlertTriangle } from 'lucide-react';

// Mock data - replace with actual API data
const mockConsultation = {
  id: '1',
  customerName: 'Roland Tony',
  customerEmail: 'ihamroland@gmail.com',
  phoneNumber: '08074238929',
  orderId: '#12345',
  consultationType: 'Virtual',
  date: 'Saturday, June 14, 2025',
  amount: 15000,
  status: 'pending',
  linkedOrder: {
    id: '#12345',
    productDescription: '22" Curly HD Lace Wig (Quantity: 1)',
    totalPrice: 15000000,
  },
  isLinkedToOrder: true,
};

export default function ConsultationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [consultation, setConsultation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load consultation data
  useEffect(() => {
    const loadConsultation = async () => {
      // Simulate API call
      setTimeout(() => {
        setConsultation(mockConsultation);
        setIsLoading(false);
      }, 1000);
    };
    
    loadConsultation();
  }, [params]);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      // TODO: Implement actual API call to update status
      console.log('Updating status to:', newStatus);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConsultation((prev: any) => ({
        ...prev,
        status: newStatus
      }));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto max-w-7xl px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="w-full mx-auto max-w-7xl px-4 py-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Consultation not found</h3>
          <p className="text-gray-500 mb-6">The consultation you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/admin/consultation')}>
            Back to Consultations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="tertiary"
            onClick={() => router.push('/admin/consultation')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Consultation</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Consultation Details</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Consultation Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Customer Details */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Details
            </h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-600">
                  {consultation.customerName.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{consultation.customerName}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Customer Email:</span>
                <span className="text-sm font-medium text-gray-900">{consultation.customerEmail}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Phone number:</span>
                <span className="text-sm font-medium text-gray-900">{consultation.phoneNumber}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Order ID:</span>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  {consultation.orderId}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <Button
                variant="tertiary"
                className="w-full justify-start"
                onClick={() => {
                  // TODO: Implement cancel booking
                  console.log('Cancel booking');
                }}
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Order and Booking Info */}
        <div className="space-y-6">
          {/* Linked Order */}
          {consultation.isLinkedToOrder && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Linked Order</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    {consultation.linkedOrder.id}
                  </button>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Product:</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {consultation.linkedOrder.productDescription}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Price:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₦{consultation.linkedOrder.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    This consultation was booked as part of the customer&apos;s wig purchase process
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Booking Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium text-gray-900">{consultation.consultationType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium text-gray-900">{consultation.date}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₦{consultation.amount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="w-32">
                  <Select
                    value={consultation.status}
                    onChange={handleStatusChange}
                    options={[
                      { label: 'Pending', value: 'pending' },
                      { label: 'Scheduled', value: 'scheduled' },
                      { label: 'Canceled', value: 'canceled' },
                      { label: 'Completed', value: 'completed' },
                    ]}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
