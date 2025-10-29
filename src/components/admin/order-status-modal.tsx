"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { Select } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface OrderStatusModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (status: string) => Promise<void>;
  currentStatus: string;
  orderId: string;
  isLoading?: boolean;
}

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  open,
  onClose,
  onConfirm,
  currentStatus,
  orderId,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleConfirm = async () => {
    if (selectedStatus !== currentStatus) {
      await onConfirm(selectedStatus);
    }
    onClose();
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order ID: <span className="font-mono text-gray-600">{orderId}</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-600">
              {statusOptions.find(option => option.value === currentStatus)?.label || currentStatus}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              placeholder="Select new status"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="tertiary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || selectedStatus === currentStatus}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
