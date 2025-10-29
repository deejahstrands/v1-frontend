"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/common/button';
import { AlertTriangle, Trash2, Info, AlertCircle } from 'lucide-react';

export type ConfirmationType = 'delete' | 'warning' | 'info' | 'danger';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  deletionItems?: string[]; // Array of items that will be deleted
  type?: ConfirmationType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const getIconAndColors = (type: ConfirmationType) => {
  switch (type) {
    case 'delete':
      return {
        icon: <Trash2 className="w-6 h-6 text-red-600" />,
        confirmVariant: 'danger' as const,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    case 'warning':
      return {
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        confirmVariant: 'warning' as const,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    case 'danger':
      return {
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        confirmVariant: 'danger' as const,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    case 'info':
    default:
      return {
        icon: <Info className="w-6 h-6 text-blue-600" />,
        confirmVariant: 'primary' as const,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
  }
};

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  deletionItems,
  type = 'delete',
  confirmText,
  cancelText = 'Cancel',
  isLoading = false
}: ConfirmationModalProps) {
  const { icon, confirmVariant, bgColor, borderColor } = getIconAndColors(type);

  const getDefaultConfirmText = () => {
    switch (type) {
      case 'delete':
        return 'Delete';
      case 'warning':
        return 'Continue';
      case 'danger':
        return 'Proceed';
      case 'info':
      default:
        return 'Confirm';
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      showCloseButton={false}
    >
      <div className="p-6">
        {/* Header */}
        <div className={`flex items-center gap-3 p-4 rounded-lg ${bgColor} ${borderColor} border mb-4`}>
          {icon}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            
            {/* Deletion Items List */}
            {deletionItems && deletionItems.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  ⚠️ This action will trigger cascading deletions:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {deletionItems.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 ml-2">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Note: This operation is irreversible. Once deleted, these items cannot be recovered.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="tertiary"
            onClick={onClose}
            className="cursor-pointer border border-amber-700 text-amber-700"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            icon={isLoading ? undefined : type === 'delete' ? <Trash2 className="w-4 h-4" /> : undefined}
            className="cursor-pointer"
          >
            {isLoading ? 'Processing...' : (confirmText || getDefaultConfirmText())}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
