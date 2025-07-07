import { create } from 'zustand';

interface ConsultationData {
  type: string;
  price: number;
  description?: string;
}

interface ConsultationState {
  enabled: boolean;
  data: ConsultationData | null;
  setConsultation: (enabled: boolean, data?: ConsultationData) => void;
  clearConsultation: () => void;
}

export const useConsultation = create<ConsultationState>((set) => ({
  enabled: false,
  data: null,
  setConsultation: (enabled, data) => set({ enabled, data: enabled ? data || null : null }),
  clearConsultation: () => set({ enabled: false, data: null }),
})); 