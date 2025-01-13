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
