"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { X, Calendar, MessageSquare } from 'lucide-react';

interface StatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: StatusUpdateData) => Promise<boolean>;
  currentStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isLoading?: boolean;
}

interface StatusUpdateData {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date?: string;
  time?: string;
  duration?: string;
  customerNote?: string;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  open,
  onClose,
  onConfirm,
  currentStatus,
  isLoading = false
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');
  const [date, setDate] = useState(''); // yyyy-mm-dd
  const [time, setTime] = useState(''); // HH:mm (24h)
  const [duration, setDuration] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or status changes
  useEffect(() => {
    if (open) {
      setSelectedStatus('pending');
      setDate('');
      setTime('');
      setDuration('');
      setCustomerNote('');
      setErrors({});
    }
  }, [open]);

  const formatDisplayDate = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  const formatTimeTo12h = (hhmm: string) => {
    if (!hhmm) return '';
    const [h, m] = hhmm.split(':');
    let hour = parseInt(h, 10);
    const meridian = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${m}${meridian}`;
  };

  const handleConfirm = async () => {
    const newErrors: Record<string, string> = {};

    // Validate based on selected status
    if (selectedStatus === 'confirmed') {
      if (!date.trim()) newErrors.date = 'Date is required for confirmed status';
      if (!time.trim()) newErrors.time = 'Time is required for confirmed status';
      if (!duration.trim()) newErrors.duration = 'Duration is required for confirmed status';
    }

    if (selectedStatus === 'completed') {
      if (!customerNote.trim()) newErrors.customerNote = 'Customer note is required for completed status';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updateData: StatusUpdateData = {
      status: selectedStatus,
    };

    // Add fields based on status
    if (selectedStatus === 'confirmed') {
      updateData.date = formatDisplayDate(date);
      updateData.time = formatTimeTo12h(time);
      updateData.duration = duration;
    }

    if (selectedStatus === 'completed') {
      updateData.customerNote = customerNote;
    }

    const success = await onConfirm(updateData);
    if (success) {
      onClose();
    }
  };

  const getModalTitle = () => {
    switch (selectedStatus) {
      case 'confirmed':
        return 'Confirm Consultation';
      case 'completed':
        return 'Mark as Completed';
      case 'cancelled':
        return 'Cancel Consultation';
      case 'pending':
        return 'Change to Pending';
      default:
        return 'Update Status';
    }
  };

  const getModalDescription = () => {
    switch (selectedStatus) {
      case 'confirmed':
        return 'Please provide the consultation details to confirm the appointment.';
      case 'completed':
        return 'Add a customer note to complete this consultation.';
      case 'cancelled':
        return 'Are you sure you want to cancel this consultation?';
      case 'pending':
        return 'Change this consultation back to pending status.';
      default:
        return 'Update the consultation status.';
    }
  };

  const getStatusOptions = () => {
    const options = [
      { label: 'Pending', value: 'pending' },
      { label: 'Confirmed', value: 'confirmed' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' },
    ];

    // Filter out current status
    return options.filter(option => option.value !== currentStatus);
  };

  const isSimpleConfirmation = selectedStatus === 'cancelled' || selectedStatus === 'pending';

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} size="md" showCloseButton={false}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-4">
          <p className="text-sm text-gray-600">{getModalDescription()}</p>

          {/* Status Selection */}
          <div>
            <Select
              label="New Status"
              value={selectedStatus}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(value) => setSelectedStatus(value as any)}
              options={getStatusOptions()}
              disabled={isLoading}
            />
          </div>

          {/* Confirmed Status Fields */}
          {selectedStatus === 'confirmed' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                Consultation Details
              </div>
              
              <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errors.date}
                disabled={isLoading}
              />
              
              <Input
                label="Time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                error={errors.time}
                disabled={isLoading}
              />
              
              <Input
                label="Duration"
                placeholder="e.g., 30mins"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                error={errors.duration}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Completed Status Fields */}
          {selectedStatus === 'completed' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageSquare className="w-4 h-4" />
                Completion Notes
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Note *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Add notes about the consultation, customer preferences, recommendations, etc."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  disabled={isLoading}
                />
                {errors.customerNote && (
                  <p className="text-sm text-red-600 mt-1">{errors.customerNote}</p>
                )}
              </div>
            </div>
          )}

          {/* Simple Confirmation for Cancelled/Pending */}
          {isSimpleConfirmation && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {selectedStatus === 'cancelled' 
                  ? 'This will mark the consultation as cancelled. The customer will be notified.'
                  : 'This will change the consultation status back to pending.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="tertiary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={selectedStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? 'Updating...' : getModalTitle()}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
