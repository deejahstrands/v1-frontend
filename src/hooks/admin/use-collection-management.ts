/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { collectionService, Collection, CreateCollectionData, UpdateCollectionData } from '@/services/admin/collection.service';

// Global flag to prevent duplicate API calls
let globalCollectionsFetching = false;

export const useCollectionManagement = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Load collections
  const loadCollections = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive';
    featured?: boolean;
  }) => {
    if (globalCollectionsFetching || isLoading) return;

    try {
      globalCollectionsFetching = true;
      setIsLoading(true);
      setError(null);
      
      const response = await collectionService.getCollections({
        page: params?.page || currentPage,
        limit: params?.limit || 10,
        search: params?.search,
        status: params?.status,
        featured: params?.featured,
      });
      
      setCollections(response.data);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load collections');
      console.error('Error loading collections:', err);
    } finally {
      setIsLoading(false);
      globalCollectionsFetching = false;
    }
  }, [currentPage, isLoading]);

  // Load all collections (for dropdowns)
  const loadAllCollections = useCallback(async (params?: {
    search?: string;
    status?: 'active' | 'inactive';
    featured?: boolean;
  }) => {
    if (globalCollectionsFetching || isLoading) return;

    try {
      globalCollectionsFetching = true;
      setIsLoading(true);
      setError(null);
      
      const allCollections = await collectionService.getAllCollections({
        search: params?.search,
        status: params?.status,
        featured: params?.featured,
      });
      
      setCollections(allCollections);
      // Don't set pagination info for all collections
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load collections');
      console.error('Error loading all collections:', err);
    } finally {
      setIsLoading(false);
      globalCollectionsFetching = false;
    }
  }, [isLoading]);

  // Create collection
  const createCollection = useCallback(async (data: CreateCollectionData): Promise<boolean> => {
    setIsSaving(true);
    setError(null);
    
    try {
      await collectionService.createCollection(data);
      await loadCollections(); // Reload collections
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create collection');
      console.error('Error creating collection:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [loadCollections]);

  // Update collection
  const updateCollection = useCallback(async (id: string, data: UpdateCollectionData): Promise<boolean> => {
    setIsSaving(true);
    setError(null);
    
    try {
      await collectionService.updateCollection(id, data);
      await loadCollections(); // Reload collections
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update collection');
      console.error('Error updating collection:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [loadCollections]);

  // Delete collection
  const deleteCollection = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await collectionService.deleteCollection(id);
      await loadCollections(); // Reload collections
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete collection');
      console.error('Error deleting collection:', err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [loadCollections]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadCollections({ page });
  }, [loadCollections]);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Initial load
  useEffect(() => {
    loadCollections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    collections,
    isLoading,
    isDeleting,
    isSaving,
    currentPage,
    totalPages,
    error,
    loadCollections,
    loadAllCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    handlePageChange,
    clearError,
  };
};
