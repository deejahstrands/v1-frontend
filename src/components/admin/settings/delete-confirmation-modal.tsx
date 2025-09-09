"use client";

import React from 'react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: 'fitting' | 'processing-time';
    isLoading?: boolean;
}

export function DeleteConfirmationModal({
    open,
    onClose,
    onConfirm,
    itemName,
    itemType,
    isLoading = false
}: DeleteConfirmationModalProps) {
    const getTitle = () => {
        return itemType === 'fitting' ? 'Delete Fitting' : 'Delete Processing Time';
    };

    const getMessage = () => {
        const itemTypeText = itemType === 'fitting' ? 'fitting' : 'Processing Time';
        return `Are you sure you want to delete the ${itemTypeText} "${itemName}"? This action cannot be undone and will remove all associated data.`;
    };

    return (
        <ConfirmationModal
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            title={getTitle()}
            message={getMessage()}
            type="delete"
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isLoading}
        />
    );
}
