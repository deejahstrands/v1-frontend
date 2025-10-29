/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { StatusUpdateModal } from '@/components/ui/status-update-modal';
import { ArrowLeft, User, Mail, Phone, Package, AlertTriangle, X } from 'lucide-react';
import { useConsultationManagement } from '@/hooks/admin/use-consultation-management';

export default function ConsultationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [consultationId, setConsultationId] = useState<string>('');
  
  const {
    currentConsultation,
    isLoadingConsultation,
    isUpdating,
    loadConsultation,
    updateConsultation,
  } = useConsultationManagement();

  // Modal states
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  // Track if we've loaded the consultation to prevent loops
  const hasLoadedConsultation = useRef(false);

  // Load consultation data
  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setConsultationId(resolvedParams.id);
    };
    
    loadParams();
  }, [params]);

  useEffect(() => {
    if (consultationId && !hasLoadedConsultation.current) {
      loadConsultation(consultationId);
      hasLoadedConsultation.current = true;
    }
  }, [consultationId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle status change
  const handleStatusChange = async (updateData: any): Promise<boolean> => {
    if (!consultationId) return false;
    
    try {
      const success = await updateConsultation(consultationId, updateData);
      return success === true;
    } catch {
      return false;
    }
  };

  // Handle status modal open
  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true);
  };

  // Handle cancel booking
  const handleCancelBooking = () => {
    setIsCancelModalOpen(true);
  };

  // Handle confirm cancel
  const handleConfirmCancel = async () => {
    if (!consultationId) return;
    
    const success = await updateConsultation(consultationId, { status: 'cancelled' });
    if (success) {
      setIsCancelModalOpen(false);
    }
  };

  if (isLoadingConsultation) {
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

  if (!currentConsultation) {
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

  const consultation = currentConsultation;

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
                  {consultation.user.firstName[0]}{consultation.user.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {consultation.user.firstName} {consultation.user.lastName}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Customer Email:</span>
                <span className="text-sm font-medium text-gray-900">{consultation.user.email}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Phone number:</span>
                <span className="text-sm font-medium text-gray-900">
                  {consultation.user.phone || 'Not provided'}
                </span>
              </div>
              
              {consultation.paymentReference && (
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Payment Reference:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {consultation.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {consultation.status !== 'cancelled' && consultation.status !== 'completed' && (
                <Button
                  variant="tertiary"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleCancelBooking}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order and Booking Info */}
        <div className="space-y-6">
          {/* Linked Order */}
          {consultation.order && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Linked Order</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    #{consultation.order.id}
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Price:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₦{parseInt(consultation.order.totalPrice || '0').toLocaleString()}
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
                <span className="text-sm font-medium text-gray-900">{consultation.consultationType.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {consultation.date || 'Not scheduled'}
                </span>
              </div>

              {consultation.time && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Time:</span>
                  <span className="text-sm font-medium text-gray-900">{consultation.time}</span>
                </div>
              )}

              {consultation.duration && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium text-gray-900">{consultation.duration}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₦{parseInt(consultation.amount).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    consultation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    consultation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    consultation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                  </span>
                  <Button
                    variant="tertiary"
                    onClick={handleOpenStatusModal}
                    disabled={isUpdating}
                    className="text-xs px-2 py-1"
                  >
                    Update
                  </Button>
                </div>
              </div>

              {consultation.customerNote && (
                <div>
                  <span className="text-sm text-gray-600">Customer Note:</span>
                  <p className="text-sm font-medium text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                    {consultation.customerNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        open={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleStatusChange}
        currentStatus={consultation.status}
        isLoading={isUpdating}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Consultation Booking"
        message={`Are you sure you want to cancel the consultation booking for "${consultation.user.firstName} ${consultation.user.lastName}"? This action will mark the consultation as cancelled.`}
        type="warning"
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        isLoading={isUpdating}
      />
    </div>
  );
}
