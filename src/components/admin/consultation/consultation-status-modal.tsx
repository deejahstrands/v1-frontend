"use client";

import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type ConsultationStatus = 'Completed' | 'Upcoming' | 'Cancelled';

interface ConsultationStatusModalProps {
  open: boolean;
  onClose: () => void;
  currentStatus: ConsultationStatus;
  onStatusChange: (status: ConsultationStatus) => void;
}

export function ConsultationStatusModal({
  open,
  onClose,
  currentStatus,
  onStatusChange,
}: ConsultationStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ConsultationStatus>(currentStatus);

  const statuses: ConsultationStatus[] = ['Completed', 'Upcoming', 'Cancelled'];

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case 'Completed':
        return 'text-green-700';
      case 'Upcoming':
        return 'text-orange-700';
      case 'Cancelled':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const handleContinue = () => {
    onStatusChange(selectedStatus);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="pt-6 min-h-[250px] flex flex-col">
        <h3 className="text-lg font-semibold text-center mb-4">Edit Status</h3>
        
        <div className="flex-1 space-y-4">
          <div className="w-full relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between px-3 py-2 border rounded-lg hover:bg-gray-50">
                <span className={getStatusColor(selectedStatus)}>{selectedStatus}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[var(--radix-dropdown-trigger-width)] z-[60]"
                sideOffset={5}
              >
                {statuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className={`${getStatusColor(status)}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-auto pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
} 