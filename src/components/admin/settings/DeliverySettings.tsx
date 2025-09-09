"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableColumn } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { AddFittingModal } from './add-fitting-modal';
import { AddProcessingTimeModal } from './add-processing-time-modal';
import { EditFittingModal } from './edit-fitting-modal';
import { EditProcessingTimeModal } from './edit-processing-time-modal';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { fittingService, processingTimeService } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';

// Global flags to prevent multiple simultaneous fetches
let globalFittingsFetching = false;
let globalProcessingTimesFetching = false;

interface FittingOption {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Inactive';
  location: string;
  default: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ProcessingTime {
  id: string;
  label: string;
  timeRange: string;
  status: 'Active' | 'Inactive';
  default: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function DeliverySettings() {
  const { toast } = useToast();
  const toastRef = useRef(toast);
  
  // Update toast ref when toast changes
  React.useEffect(() => {
    toastRef.current = toast;
  }, [toast]);
  
  // Modal states
  const [addFittingModalOpen, setAddFittingModalOpen] = useState(false);
  const [addProcessingTimeModalOpen, setAddProcessingTimeModalOpen] = useState(false);
  const [editFittingModalOpen, setEditFittingModalOpen] = useState(false);
  const [editProcessingTimeModalOpen, setEditProcessingTimeModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFitting, setSelectedFitting] = useState<FittingOption | null>(null);
  const [selectedProcessingTime, setSelectedProcessingTime] = useState<ProcessingTime | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ type: 'fitting' | 'processing-time'; item: FittingOption | ProcessingTime } | null>(null);
  const [isLoadingFittings, setIsLoadingFittings] = useState(false);
  const [isLoadingProcessingTimes, setIsLoadingProcessingTimes] = useState(false);

  // Delivery settings data
  const [privateFittings, setPrivateFittings] = useState<FittingOption[]>([]);
  const [processingTimes, setProcessingTimes] = useState<ProcessingTime[]>([]);

  const loadFittings = async () => {
    if (globalFittingsFetching || isLoadingFittings) return; // Prevent duplicate calls
    
    try {
      globalFittingsFetching = true;
      setIsLoadingFittings(true);
      const response = await fittingService.getFittings();
      setPrivateFittings(response.data);
    } catch (error) {
      console.error('Error loading fittings:', error);
      toastRef.current.error('Failed to load fitting options');
    } finally {
      setIsLoadingFittings(false);
      globalFittingsFetching = false;
    }
  };

  const loadProcessingTimes = async () => {
    if (globalProcessingTimesFetching || isLoadingProcessingTimes) return; // Prevent duplicate calls
    
    try {
      globalProcessingTimesFetching = true;
      setIsLoadingProcessingTimes(true);
      const response = await processingTimeService.getProcessingTimes();
      setProcessingTimes(response.data);
    } catch (error) {
      console.error('Error loading processing times:', error);
      toastRef.current.error('Failed to load processing times');
    } finally {
      setIsLoadingProcessingTimes(false);
      globalProcessingTimesFetching = false;
    }
  };

  // Load data on component mount
  React.useEffect(() => {
    loadFittings();
    loadProcessingTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  // Delivery settings handlers
  const handleAddFitting = () => {
    setAddFittingModalOpen(true);
  };

  const handleEditFitting = (fitting: FittingOption) => {
    setSelectedFitting(fitting);
    setEditFittingModalOpen(true);
  };

  const handleDeleteFitting = (fitting: FittingOption) => {
    setDeleteItem({ type: 'fitting', item: fitting });
    setDeleteModalOpen(true);
  };

  const handleAddProcessingTime = () => {
    setAddProcessingTimeModalOpen(true);
  };

  const handleEditProcessingTime = (processingTime: ProcessingTime) => {
    setSelectedProcessingTime(processingTime);
    setEditProcessingTimeModalOpen(true);
  };

  const handleDeleteProcessingTime = (processingTime: ProcessingTime) => {
    setDeleteItem({ type: 'processing-time', item: processingTime });
    setDeleteModalOpen(true);
  };

  // Modal handlers
  const handleSaveFitting = async (data: Omit<FittingOption, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    try {
      await fittingService.createFitting(data);
      toastRef.current.success('Fitting option added successfully!');
      await loadFittings(); // Reload data from API
    } catch (error) {
      console.error('Error saving fitting:', error);
      toastRef.current.error('Failed to save fitting option');
    }
  };

  const handleUpdateFitting = async (data: Partial<FittingOption>) => {
    if (!selectedFitting) return;
    
    try {
      await fittingService.updateFitting(selectedFitting.id, data);
      toastRef.current.success('Fitting option updated successfully!');
      await loadFittings(); // Reload data from API
    } catch (error) {
      console.error('Error updating fitting:', error);
      toastRef.current.error('Failed to update fitting option');
    }
  };

  const handleSaveProcessingTime = async (data: Omit<ProcessingTime, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    try {
      await processingTimeService.createProcessingTime(data);
      toastRef.current.success('Processing time added successfully!');
      await loadProcessingTimes(); // Reload data from API
    } catch (error) {
      console.error('Error saving processing time:', error);
      toastRef.current.error('Failed to save processing time');
    }
  };

  const handleUpdateProcessingTime = async (data: Partial<ProcessingTime>) => {
    if (!selectedProcessingTime) return;
    
    try {
      await processingTimeService.updateProcessingTime(selectedProcessingTime.id, data);
      toastRef.current.success('Processing time updated successfully!');
      await loadProcessingTimes(); // Reload data from API
    } catch (error) {
      console.error('Error updating processing time:', error);
      toastRef.current.error('Failed to update processing time');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    
    try {
      if (deleteItem.type === 'fitting') {
        await fittingService.deleteFitting(deleteItem.item.id);
        toastRef.current.success('Fitting option deleted successfully!');
        await loadFittings(); // Reload data from API
      } else {
        await processingTimeService.deleteProcessingTime(deleteItem.item.id);
        toastRef.current.success('Processing time deleted successfully!');
        await loadProcessingTimes(); // Reload data from API
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toastRef.current.error('Failed to delete item');
    } finally {
      setDeleteModalOpen(false);
      setDeleteItem(null);
    }
  };

  // Table column definitions
  const privateFittingsColumns: TableColumn<FittingOption>[] = [
    { label: 'Fitting Name', accessor: 'name' },
    { label: 'Type', accessor: 'type' },
    {
      label: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {row.status}
        </span>
      )
    },
    { label: 'Location', accessor: 'location' },
    {
      label: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border border-gray-200 shadow-lg">
              <DropdownMenuItem onClick={() => handleEditFitting(row)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteFitting(row)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const processingTimesColumns: TableColumn<ProcessingTime>[] = [
    { label: 'Label', accessor: 'label' },
    { label: 'Time Range', accessor: 'timeRange' },
    {
      label: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {row.status}
        </span>
      )
    },
    {
      label: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border border-gray-200 shadow-lg">
              <DropdownMenuItem onClick={() => handleEditProcessingTime(row)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProcessingTime(row)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Private Fittings Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Private Fittings</h3>
              <p className="text-sm text-gray-500">Manage fitting options available to customers</p>
            </div>
            <Button
              variant="black"
              onClick={handleAddFitting}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Fitting Options
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <Table
            columns={privateFittingsColumns}
            data={privateFittings}
            isLoading={isLoadingFittings}
            footerContent={
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Page 1 of 1</span>
              </div>
            }
          />
        </div>
      </div>

      {/* Processing Times Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Processing Times</h3>
              <p className="text-sm text-gray-500">Manage processing time options for orders</p>
            </div>
            <Button
              variant="black"
              onClick={handleAddProcessingTime}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Processing Time
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <Table
            columns={processingTimesColumns}
            data={processingTimes}
            isLoading={isLoadingProcessingTimes}
            footerContent={
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Page 1 of 1</span>
              </div>
            }
          />
        </div>
      </div>

      {/* Modals */}
      <AddFittingModal
        open={addFittingModalOpen}
        onClose={() => setAddFittingModalOpen(false)}
        onSave={handleSaveFitting}
      />

      <AddProcessingTimeModal
        open={addProcessingTimeModalOpen}
        onClose={() => setAddProcessingTimeModalOpen(false)}
        onSave={handleSaveProcessingTime}
      />

      <EditFittingModal
        open={editFittingModalOpen}
        onClose={() => {
          setEditFittingModalOpen(false);
          setSelectedFitting(null);
        }}
        onSave={handleUpdateFitting}
        fitting={selectedFitting}
      />

      <EditProcessingTimeModal
        open={editProcessingTimeModalOpen}
        onClose={() => {
          setEditProcessingTimeModalOpen(false);
          setSelectedProcessingTime(null);
        }}
        onSave={handleUpdateProcessingTime}
        processingTime={selectedProcessingTime}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteItem(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={deleteItem?.type === 'fitting' ? (deleteItem.item as FittingOption).name : (deleteItem?.item as ProcessingTime)?.label || ''}
        itemType={deleteItem?.type || 'fitting'}
      />
    </div>
  );
}

