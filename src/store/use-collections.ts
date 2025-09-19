import { create } from "zustand";
import { 
  Collection, 
  FeaturedCollection,
  GetCollectionsParams,
  GetFeaturedCollectionParams 
} from "@/types/collection";
import { collectionsService } from "@/services/collections";

interface CollectionsState {
  // Collections list state
  collections: Collection[];
  loading: boolean;
  error: string | null;
  
  // Featured collection state
  featuredCollection: FeaturedCollection | null;
  featuredLoading: boolean;
  featuredError: string | null;
  
  // Single collection state
  currentCollection: FeaturedCollection | null;
  collectionLoading: boolean;
  collectionError: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;

  // Actions
  fetchCollections: (params?: GetCollectionsParams) => Promise<void>;
  fetchActiveCollections: () => Promise<void>;
  fetchFeaturedCollection: (params?: GetFeaturedCollectionParams) => Promise<void>;
  fetchCollectionWithProducts: (id: string) => Promise<void>;
  clearError: () => void;
  clearFeaturedError: () => void;
  clearCollectionError: () => void;
  reset: () => void;
  resetFeaturedCollection: () => void;
  resetCurrentCollection: () => void;
}

const initialState = {
  collections: [],
  loading: false,
  error: null,
  
  // Featured collection
  featuredCollection: null,
  featuredLoading: false,
  featuredError: null,
  
  // Single collection
  currentCollection: null,
  collectionLoading: false,
  collectionError: null,
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrev: false,
};

export const useCollections = create<CollectionsState>((set) => ({
  ...initialState,

  fetchCollections: async (params) => {
    set({ loading: true, error: null });
    
    try {
      const response = await collectionsService.getCollections(params);
      
      set({
        collections: response.data,
        currentPage: response.meta?.page || 1,
        totalPages: response.meta?.totalPages || 1,
        totalItems: response.meta?.totalItems || response.data.length,
        hasNext: response.meta?.hasNext || false,
        hasPrev: response.meta?.hasPrev || false,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch collections",
      });
    }
  },

  fetchActiveCollections: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await collectionsService.getActiveCollections();
      
      set({
        collections: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch collections",
      });
    }
  },

  fetchFeaturedCollection: async (params) => {
    set({ featuredLoading: true, featuredError: null });
    
    try {
      const response = await collectionsService.getFeaturedCollection(params);
      
      set({
        featuredCollection: response.data,
        featuredLoading: false,
        featuredError: null,
      });
    } catch (error) {
      set({
        featuredLoading: false,
        featuredError: error instanceof Error ? error.message : "Failed to fetch featured collection",
      });
    }
  },

  fetchCollectionWithProducts: async (id) => {
    set({ collectionLoading: true, collectionError: null });
    
    try {
      const response = await collectionsService.getCollectionWithProducts(id);
      
      set({
        currentCollection: response.data,
        collectionLoading: false,
        collectionError: null,
      });
    } catch (error) {
      set({
        collectionLoading: false,
        collectionError: error instanceof Error ? error.message : "Failed to fetch collection",
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearFeaturedError: () => {
    set({ featuredError: null });
  },

  clearCollectionError: () => {
    set({ collectionError: null });
  },

  reset: () => {
    set(initialState);
  },

  resetFeaturedCollection: () => {
    set({
      featuredCollection: null,
      featuredLoading: false,
      featuredError: null,
    });
  },

  resetCurrentCollection: () => {
    set({
      currentCollection: null,
      collectionLoading: false,
      collectionError: null,
    });
  },
}));
