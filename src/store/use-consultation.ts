import { create } from 'zustand';
import { consultationService, type ConsultationType, type GetConsultationTypesParams, type BookConsultationRequest, type Consultation, type GetConsultationsParams } from '@/services/consultation';

interface ConsultationState {
  // State
  consultationTypes: ConsultationType[];
  selectedConsultation: ConsultationType | null;
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;

  // Booking state
  isBooking: boolean;
  bookingError: string | null;

  // User consultations
  consultations: Consultation[];
  consultationsLoading: boolean;
  consultationsError: string | null;
  consultationsPage: number;
  consultationsTotalPages: number;
  consultationsTotalItems: number;
  consultationsHasNext: boolean;
  consultationsHasPrev: boolean;

  // Actions
  fetchConsultationTypes: (params?: GetConsultationTypesParams) => Promise<void>;
  fetchConsultations: (params?: GetConsultationsParams) => Promise<void>;
  bookConsultation: (data: BookConsultationRequest) => Promise<void>;
  setSelectedConsultation: (consultation: ConsultationType | null) => void;
  clearConsultation: () => void;
  hasConsultation: () => boolean;
  getConsultationPrice: () => number;
  clearError: () => void;
  clearBookingError: () => void;
  clearConsultationsError: () => void;
  reset: () => void;
}

const initialState = {
  consultationTypes: [],
  selectedConsultation: null,
  loading: false,
  error: null,
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrev: false,

  // Booking state
  isBooking: false,
  bookingError: null,

  // User consultations
  consultations: [],
  consultationsLoading: false,
  consultationsError: null,
  consultationsPage: 1,
  consultationsTotalPages: 1,
  consultationsTotalItems: 0,
  consultationsHasNext: false,
  consultationsHasPrev: false,
};

export const useConsultation = create<ConsultationState>((set, get) => ({
  ...initialState,

  fetchConsultationTypes: async (params) => {
    set({ loading: true, error: null });
    
    try {
      const response = await consultationService.getConsultationTypes(params);
      
      set({
        consultationTypes: response.data,
        currentPage: response.meta.page,
        totalPages: response.meta.totalPages,
        totalItems: response.meta.totalItems,
        hasNext: response.meta.hasNext,
        hasPrev: response.meta.hasPrev,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch consultation types",
      });
    }
  },

  fetchConsultations: async (params) => {
    set({ consultationsLoading: true, consultationsError: null });
    
    try {
      const response = await consultationService.getConsultations(params);
      
      set({
        consultations: response.data,
        consultationsPage: response.meta.page,
        consultationsTotalPages: response.meta.totalPages,
        consultationsTotalItems: response.meta.totalItems,
        consultationsHasNext: response.meta.hasNext,
        consultationsHasPrev: response.meta.hasPrev,
        consultationsLoading: false,
        consultationsError: null,
      });
    } catch (error) {
      set({
        consultationsLoading: false,
        consultationsError: error instanceof Error ? error.message : "Failed to fetch consultations",
      });
    }
  },

  bookConsultation: async (data) => {
    set({ isBooking: true, bookingError: null });
    
    try {
      const response = await consultationService.bookConsultation(data);
      
      // Redirect to Paystack payment page
      window.location.href = response.data.authorization_url;
      
    } catch (error) {
      set({
        isBooking: false,
        bookingError: error instanceof Error ? error.message : "Failed to book consultation",
      });
    }
  },

  setSelectedConsultation: (consultation) => set({ selectedConsultation: consultation }),
  
  clearConsultation: () => set({ selectedConsultation: null }),
  
  hasConsultation: () => get().selectedConsultation !== null,
  
  getConsultationPrice: () => {
    const consultation = get().selectedConsultation;
    return consultation ? parseInt(consultation.price) : 0;
  },

  clearError: () => set({ error: null }),

  clearBookingError: () => set({ bookingError: null }),

  clearConsultationsError: () => set({ consultationsError: null }),

  reset: () => set(initialState),
})); 