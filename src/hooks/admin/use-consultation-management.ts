
import { useState, useEffect, useCallback } from 'react';
import { consultationService, Consultation, ConsultationListItem, UpdateConsultationData, ConsultationParams } from '@/services/admin/consultation.service';
import { useToast } from '@/hooks/use-toast';

// Global flags to prevent duplicate API calls
let globalConsultationsFetching = false;
let globalConsultationFetching = false;

export const useConsultationManagement = () => {
  const { toast } = useToast();

  // State
  const [consultations, setConsultations] = useState<ConsultationListItem[]>([]);
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const [isLoadingConsultations, setIsLoadingConsultations] = useState(false);
  const [isLoadingConsultation, setIsLoadingConsultation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Load consultations
  const loadConsultations = useCallback(async (params?: ConsultationParams) => {
    if (globalConsultationsFetching || isLoadingConsultations) return;

    try {
      globalConsultationsFetching = true;
      setIsLoadingConsultations(true);
      setError(null);

      const response = await consultationService.getConsultations({
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search,
        status: params?.status,
        typeId: params?.typeId,
        type: params?.type,
      });

      setConsultations(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);
      setCurrentPage(response.meta.page);
    } catch (err) {
      console.error('Error loading consultations:', err);
      setError('Failed to load consultations');
      toast.error('Failed to load consultations');
    } finally {
      setIsLoadingConsultations(false);
      globalConsultationsFetching = false;
    }
  }, [isLoadingConsultations, toast]);

  // Load single consultation
  const loadConsultation = useCallback(async (id: string) => {
    if (globalConsultationFetching || isLoadingConsultation) return;

    try {
      globalConsultationFetching = true;
      setIsLoadingConsultation(true);
      setError(null);

      const response = await consultationService.getConsultation(id);
      setCurrentConsultation(response.data);
      return response.data;
    } catch (err) {
      console.error('Error loading consultation:', err);
      setError('Failed to load consultation');
      toast.error('Failed to load consultation');
      return null;
    } finally {
      setIsLoadingConsultation(false);
      globalConsultationFetching = false;
    }
  }, [isLoadingConsultation, toast]);

  // Update consultation
  const updateConsultation = useCallback(async (id: string, data: UpdateConsultationData) => {
    try {
      setIsUpdating(true);
      setError(null);

      await consultationService.updateConsultation(id, data);
      
      // Update local state
      setConsultations(prev => prev.map(consultation => 
        consultation.id === id 
          ? { ...consultation, status: data.status || consultation.status }
          : consultation
      ));

      // Update current consultation if it's the same one
      if (currentConsultation?.id === id) {
        setCurrentConsultation(prev => prev ? { ...prev, ...data } : null);
      }

      toast.success('Consultation updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating consultation:', err);
      setError('Failed to update consultation');
      toast.error('Failed to update consultation');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [currentConsultation, toast]);

  // Delete consultation
  const deleteConsultation = useCallback(async (id: string) => {
    try {
      setIsDeleting(true);
      setError(null);

      await consultationService.deleteConsultation(id);
      
      // Remove from local state
      setConsultations(prev => prev.filter(consultation => consultation.id !== id));
      
      // Clear current consultation if it's the same one
      if (currentConsultation?.id === id) {
        setCurrentConsultation(null);
      }

      // Update meta
      setTotalItems(prev => prev - 1);

      toast.success('Consultation deleted successfully!');
      return true;
    } catch (err) {
      console.error('Error deleting consultation:', err);
      setError('Failed to delete consultation');
      toast.error('Failed to delete consultation');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [currentConsultation, toast]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      globalConsultationsFetching = false;
      globalConsultationFetching = false;
    };
  }, []);

  return {
    // Data
    consultations,
    currentConsultation,
    
    // Loading states
    isLoadingConsultations,
    isLoadingConsultation,
    isUpdating,
    isDeleting,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    
    // Error handling
    error,
    clearError,
    
    // Actions
    loadConsultations,
    loadConsultation,
    updateConsultation,
    deleteConsultation,
    setCurrentPage,
  };
};
