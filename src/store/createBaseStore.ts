import { StateCreator } from 'zustand';
import { ApiError, PaginatedResponse, BaseStore } from '../types/api';
import axiosInstance from '../api/axiosInstance';

// Base store state
interface BaseStoreState<T> extends BaseStore<T> {
  // Additional common state can be added here
}

// Base store actions
interface BaseStoreActions<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  // CRUD operations
  getAll: (page?: number, limit?: number) => Promise<void>;
  getById: (id: number) => Promise<T | null>;
  create: (data: TCreate) => Promise<T | null>;
  update: (id: number, data: TUpdate) => Promise<T | null>;
  delete: (id: number) => Promise<boolean>;
  
  // Utility methods
  refresh: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Complete store type
export type BaseStoreType<T, TCreate = Partial<T>, TUpdate = Partial<T>> = 
  BaseStoreState<T> & BaseStoreActions<T, TCreate, TUpdate>;

// Store configuration
interface StoreConfig {
  endpoint: string;
  initialLimit?: number;
}

// Factory function to create base store
export function createBaseStore<T extends { id: number }, TCreate = Partial<T>, TUpdate = Partial<T>>(
  config: StoreConfig
): StateCreator<BaseStoreType<T, TCreate, TUpdate>> {
  
  return (set, get) => ({
    // State
    data: [],
    total: 0,
    limit: config.initialLimit || 10,
    skip: 0,
    page: 1,
    isLoading: false,
    error: null,

    // Base actions
    setPage: (page: number) => {
      set({ page });
    },

    clearError: () => {
      set({ error: null });
    },

    setLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    setError: (error: string | null) => {
      set({ error, isLoading: false });
    },

    // CRUD operations
    getAll: async (page?: number, limit?: number) => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);

        const currentPage = page ?? get().page;
        const currentLimit = limit ?? get().limit;
        const skip = (currentPage - 1) * currentLimit;

        const response = await axiosInstance.get(
          `${config.endpoint}?limit=${currentLimit}&skip=${skip}`
        );

        if (response.status === 200) {
          const responseData: PaginatedResponse<T> = response.data;
          
          set({
            data: responseData.items,
            total: responseData.total,
            limit: responseData.limit,
            skip: responseData.skip,
            page: currentPage,
            isLoading: false,
          });
        }
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || `Failed to fetch ${config.endpoint}`);
      }
    },

    getById: async (id: number): Promise<T | null> => {
      const { setLoading, setError } = get();
      
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(`${config.endpoint}/${id}`);
        
        if (response.status === 200) {
          setLoading(false);
          return response.data;
        }
        
        throw new Error('Item not found');
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || `Failed to fetch item ${id}`);
        return null;
      }
    },

    create: async (data: TCreate): Promise<T | null> => {
      const { setLoading, setError, refresh } = get();
      
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.post(config.endpoint, data);
        
        if (response.status === 200 || response.status === 201) {
          setLoading(false);
          // Refresh the list to include the new item
          await refresh();
          return response.data;
        }
        
        throw new Error('Failed to create item');
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || 'Failed to create item');
        return null;
      }
    },

    update: async (id: number, data: TUpdate): Promise<T | null> => {
      const { setLoading, setError, refresh } = get();
      
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.put(`${config.endpoint}/${id}`, data);
        
        if (response.status === 200) {
          setLoading(false);
          // Refresh the list to show updated data
          await refresh();
          return response.data;
        }
        
        throw new Error('Failed to update item');
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || `Failed to update item ${id}`);
        return null;
      }
    },

    delete: async (id: number): Promise<boolean> => {
      const { setLoading, setError, refresh } = get();
      
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.delete(`${config.endpoint}/${id}`);
        
        if (response.status === 200 || response.status === 204) {
          setLoading(false);
          // Refresh the list to remove the deleted item
          await refresh();
          return true;
        }
        
        throw new Error('Failed to delete item');
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || `Failed to delete item ${id}`);
        return false;
      }
    },

    refresh: async () => {
      const { getAll, page, limit } = get();
      await getAll(page, limit);
    },
  });
}

// Utility function to create store with additional actions
export function createExtendedStore<
  T extends { id: number }, 
  TCreate = Partial<T>, 
  TUpdate = Partial<T>,
  TExtended = object
>(
  config: StoreConfig,
  extendedActions: StateCreator<BaseStoreType<T, TCreate, TUpdate> & TExtended, [], [], TExtended>
): StateCreator<BaseStoreType<T, TCreate, TUpdate> & TExtended> {
  
  return (set, get, api) => ({
    ...createBaseStore<T, TCreate, TUpdate>(config)(set, get, api),
    ...extendedActions(set, get, api),
  });
} 