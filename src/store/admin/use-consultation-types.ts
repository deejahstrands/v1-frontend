/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { consultationTypeService, ConsultationType, CreateConsultationTypeData, UpdateConsultationTypeData } from '@/services/admin/consultation-type.service';

interface ConsultationTypesState {
  // Data
  consultationTypes: ConsultationType[];
  currentConsultationType: ConsultationType | null;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  
  // Search and filters
  searchTerm: string;
  statusFilter: 'active' | 'inactive' | 'all';
  
  // Error handling
  error: string | null;
  
  // Actions
  setConsultationTypes: (types: ConsultationType[]) => void;
  setCurrentConsultationType: (type: ConsultationType | null) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: 'active' | 'inactive' | 'all') => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // API calls
  fetchConsultationTypes: () => Promise<void>;
  createConsultationType: (data: CreateConsultationTypeData) => Promise<ConsultationType | null>;
  updateConsultationType: (id: string, data: UpdateConsultationTypeData) => Promise<{ success: boolean; message: string } | null>;
  deleteConsultationType: (id: string) => Promise<boolean>;
  
  // Utility functions
  resetState: () => void;
  getFilteredConsultationTypes: () => ConsultationType[];
  getPaginatedConsultationTypes: () => ConsultationType[];
}

export const useConsultationTypesStore = create<ConsultationTypesState>((set, get) => ({
  // Initial state
  consultationTypes: [],
  currentConsultationType: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
  searchTerm: '',
  statusFilter: 'all',
  error: null,

  // Setters
  setConsultationTypes: (types) => set({ consultationTypes: types }),
  setCurrentConsultationType: (type) => set({ currentConsultationType: type }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (limit) => set({ itemsPerPage: limit }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // API calls
  fetchConsultationTypes: async () => {
    try {
      set({ isLoading: true, error: null });
      const { currentPage, itemsPerPage, searchTerm, statusFilter } = get();
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await consultationTypeService.getConsultationTypes(params);
      
      set({
        consultationTypes: response.data,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch consultation types:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch consultation types",
        isLoading: false,
      });
    }
  },


  createConsultationType: async (data) => {
    try {
      set({ isCreating: true, error: null });
      const response = await consultationTypeService.createConsultationType(data);
      set({ isCreating: false });
      
      // Refresh the consultation types list
      get().fetchConsultationTypes();
      
      return response.data;
    } catch (error: any) {
      console.error("Failed to create consultation type:", error);
      set({
        error: error.response?.data?.message || "Failed to create consultation type",
        isCreating: false,
      });
      return null;
    }
  },

  updateConsultationType: async (id, data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await consultationTypeService.updateConsultationType(id, data);
      set({ isUpdating: false });
      
      // Refresh the consultation types list
      get().fetchConsultationTypes();
      
      return { success: true, message: response.message };
    } catch (error: any) {
      console.error("Failed to update consultation type:", error);
      set({
        error: error.response?.data?.message || "Failed to update consultation type",
        isUpdating: false,
      });
      return null;
    }
  },

  deleteConsultationType: async (id) => {
    try {
      set({ isDeleting: true, error: null });
      await consultationTypeService.deleteConsultationType(id);
      set({ isDeleting: false });
      
      // Refresh the consultation types list
      get().fetchConsultationTypes();
      
      return true;
    } catch (error: any) {
      console.error("Failed to delete consultation type:", error);
      set({
        error: error.response?.data?.message || "Failed to delete consultation type",
        isDeleting: false,
      });
      return false;
    }
  },

  // Utility functions
  resetState: () => set({
    consultationTypes: [],
    currentConsultationType: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    searchTerm: '',
    statusFilter: 'all',
    error: null,
  }),

  getFilteredConsultationTypes: () => {
    const { consultationTypes, searchTerm, statusFilter } = get();
    
    return consultationTypes.filter(type => {
      const matchesSearch = !searchTerm || 
        type.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || type.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  },

  getPaginatedConsultationTypes: () => {
    const { currentPage, itemsPerPage } = get();
    const filtered = get().getFilteredConsultationTypes();
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filtered.slice(startIndex, endIndex);
  },
}));
