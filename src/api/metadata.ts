import axiosInstance from "./axiosInstance";

export interface ForeignKeyInfo {
    target_table: string;
    target_model: string;
    target_field: string;
}

export interface FieldMetadata {
    type: string;
    nullable: boolean;
    primary_key: boolean;
    foreign_key?: ForeignKeyInfo;
}

export interface ModelMetadataResponse {
    models: {
        [modelName: string]: {
            [fieldName: string]: FieldMetadata;
        };
    };
}

export const fetchModelMetadata = async (): Promise<ModelMetadataResponse> => {
    const response = await axiosInstance.get('metadata/models');
    return response.data;
};