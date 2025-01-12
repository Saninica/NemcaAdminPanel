import { create } from 'zustand';
import { fetchModelMetadata, ModelMetadataResponse } from '../api/metadata';


export interface MetadataStore {
  models: ModelMetadataResponse;
  metadataLoading: boolean;
  metadataError: boolean;
  fetchMetadata: () => Promise<void>;
}

const useMetadataStore = create<MetadataStore>((set, get) => ({
  models: get().models || {},
  metadataLoading: false,
  metadataError: false,

  fetchMetadata: async () => {
    if (Object.keys(get().models).length > 0) {
      return;
    }

    set({ metadataLoading: true, metadataError: false });
    try {
      const response = await fetchModelMetadata()
      set({ models: response, metadataLoading: false });
    } catch (error) {
      console.error('Error fetching metadata:', error);
      set({ metadataError: true, metadataLoading: false });
    }
  },
}));

export default useMetadataStore;