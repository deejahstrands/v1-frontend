import { create } from 'zustand';

interface MeasurementsData {
  hasMeasurements: string;
  earToEar: string;
  headCircumference: string;
  foreheadToNape: string;
  hairlinePictures: File | null;
  styleReference: File | null;
}

interface MeasurementsStore {
  data: MeasurementsData;
  setData: (data: Partial<MeasurementsData>) => void;
  setField: (field: keyof MeasurementsData, value: string | File | null) => void;
  reset: () => void;
  isValid: () => boolean;
}

const initialData: MeasurementsData = {
  hasMeasurements: '',
  earToEar: '',
  headCircumference: '',
  foreheadToNape: '',
  hairlinePictures: null,
  styleReference: null,
};

export const useMeasurements = create<MeasurementsStore>((set, get) => ({
  data: initialData,
  
  setData: (newData) => set((state) => ({
    data: { ...state.data, ...newData }
  })),
  
  setField: (field, value) => set((state) => ({
    data: { ...state.data, [field]: value }
  })),
  
  reset: () => set({ data: initialData }),
  
  isValid: () => {
    const { data } = get();
    
    if (!data.hasMeasurements) return false;
    
    if (data.hasMeasurements === 'yes') {
      if (!data.earToEar || !data.headCircumference) return false;
    }
    
    return true;
  },
})); 