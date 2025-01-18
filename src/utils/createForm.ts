import { fetchModelMetadata, ModelMetadataResponse } from "../api/metadata";
import { FormField, InputType } from "../types/form";

export const initializeForm = async (modelName: string) => {

    try {
      const metadata: ModelMetadataResponse = await fetchModelMetadata();
    
      const modelMetadata = metadata.models[modelName];

      if (!modelMetadata) {
        throw new Error(`Model Language not found in metadata.`);
      }
      
      const dynamicFields: FormField<any, any>[] = [];
      
      for (const [fieldName, fieldInfo] of Object.entries(modelMetadata)) {
        const { type, nullable } = fieldInfo;
        
        let inputType: InputType = 'text';
        
        switch (type) {
          case 'int':
            inputType = 'number';
            break;
          case 'str':
            inputType = 'text';
            if (fieldName.includes('image') || fieldName.includes('img')) {
              inputType = 'img';
            }
            break;
          case 'textarea':
            inputType = 'textarea';
            break;
          case 'datetime':
            inputType = 'date';
            break;
          default:
            inputType = 'text';
        }
                 
        
        // Customize label (optional)
        const label = fieldName
          .replace('_', ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
        
        dynamicFields.push({
          name: fieldName,
          label,
          type: inputType,
          placeholder: `Enter ${label}`,
          required: !nullable,
        });
      }
      
      return dynamicFields;
    } catch (err: any) {
      console.error(err);
    }
  };