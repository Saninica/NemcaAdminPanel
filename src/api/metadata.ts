import { ModelMetadataResponse } from "../types/metadata";
import axiosInstance from "./axiosInstance";

export const fetchModelMetadata = async (): Promise<ModelMetadataResponse> => {
    const response = await axiosInstance.get('metadata/models');
    return response.data;
};

export type { ModelMetadataResponse };
