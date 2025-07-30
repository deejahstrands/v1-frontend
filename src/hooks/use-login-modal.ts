import { create } from 'zustand';

interface LoginModalState {
  isOpen: boolean;
  title: string;
  onSuccess?: () => void;
  openModal: (title?: string, onSuccess?: () => void) => void;
  closeModal: () => void;
}

export const useLoginModal = create<LoginModalState>((set) => ({
  isOpen: false,
  title: 'Login Required',
  onSuccess: undefined,
  openModal: (title = 'Login Required', onSuccess) => 
    set({ isOpen: true, title, onSuccess }),
  closeModal: () => 
    set({ isOpen: false, title: 'Login Required', onSuccess: undefined }),
})); 