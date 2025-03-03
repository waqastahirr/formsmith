
export type FieldType = 
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'textArray'
  | 'numberArray'
  | 'email'
  | 'password'
  | 'date'
  | 'textarea'
  | 'naturalGasInput';  // New composite field type

export interface FieldOption {
  label: string;
  value: string;
}

// New interface for natural gas input subfields
export interface NaturalGasSubFields {
  value: string;
  units: string;
  type: string;
  stage: string;
  use: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  defaultValue?: any;
  description?: string;
  validations?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    minItems?: number;
    maxItems?: number;
  };
  subFieldOptions?: {
    units?: FieldOption[];
    types?: FieldOption[];
    stages?: FieldOption[];
    uses?: FieldOption[];
  };
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  submitMessage?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}
