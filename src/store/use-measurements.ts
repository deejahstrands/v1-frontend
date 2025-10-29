import { create } from 'zustand';

interface MeasurementsData {
  hasMeasurements: string;
  earToEar: string;
  headCircumference: string;
  foreheadToNape: string;
  hairlinePictures: File[] | string[];
  styleReference: File[] | string[];
}

interface MeasurementsStore {
  data: MeasurementsData;
  setData: (data: Partial<MeasurementsData>) => void;
  setField: (field: keyof MeasurementsData, value: string | File[] | string[] | (File | string)[] | File | null) => void;
  addFile: (field: 'hairlinePictures' | 'styleReference', file: File) => void;
  removeFile: (field: 'hairlinePictures' | 'styleReference', index: number) => void;
  reset: () => void;
  isValid: () => boolean;
}

const initialData: MeasurementsData = {
  hasMeasurements: '',
  earToEar: '',
  headCircumference: '',
  foreheadToNape: '',
  hairlinePictures: [],
  styleReference: [],
};

export const useMeasurements = create<MeasurementsStore>((set, get) => ({
  data: initialData,
  
  setData: (newData) => set((state) => ({
    data: { ...state.data, ...newData }
  })),
  
  setField: (field, value) => set((state) => ({
    data: { ...state.data, [field]: value }
  })),

  addFile: (field, file) => set((state) => ({
    data: {
      ...state.data,
      [field]: [...state.data[field], file]
    }
  })),

  removeFile: (field, index) => set((state) => ({
    data: {
      ...state.data,
      [field]: state.data[field].filter((_, i) => i !== index)
    }
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