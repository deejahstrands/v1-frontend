import { create } from 'zustand';

interface ConsultationType {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface ConsultationState {
  selectedConsultation: ConsultationType | null;
  setSelectedConsultation: (consultation: ConsultationType | null) => void;
  clearConsultation: () => void;
  hasConsultation: () => boolean;
  getConsultationPrice: () => number;
}

export const useConsultation = create<ConsultationState>((set, get) => ({
  selectedConsultation: null,
  setSelectedConsultation: (consultation) => set({ selectedConsultation: consultation }),
  clearConsultation: () => set({ selectedConsultation: null }),
  hasConsultation: () => get().selectedConsultation !== null,
  getConsultationPrice: () => get().selectedConsultation?.price || 0,
})); 