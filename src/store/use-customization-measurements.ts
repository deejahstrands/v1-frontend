import { create } from 'zustand';

interface CustomizationMeasurementsData {
  hasMeasurements: string;
  earToEar: string;
  headCircumference: string;
  hairlinePictures: File | null;
  styleReference: File | null;
}

interface CustomizationMeasurementsState {
  data: CustomizationMeasurementsData;
  setField: (field: keyof CustomizationMeasurementsData, value: string | File | null) => void;
  reset: () => void;
}

const initialData: CustomizationMeasurementsData = {
  hasMeasurements: '',
  earToEar: '',
  headCircumference: '',
  hairlinePictures: null,
  styleReference: null,
};

export const useCustomizationMeasurements = create<CustomizationMeasurementsState>((set) => ({
  data: initialData,
  setField: (field, value) => set((state) => ({
    data: { ...state.data, [field]: value },
  })),
  reset: () => set({ data: initialData }),
})); 