
import { Form, FormField, FormSubmission, CustomFieldTemplate } from "@/types/formTypes";

// In a real application, these would be API calls to your Express backend
// For now, we'll use localStorage for persistence

const FORMS_STORAGE_KEY = 'form_builder_forms';
const CUSTOM_FIELDS_STORAGE_KEY = 'form_builder_custom_fields';

// Helper to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Load forms from storage
const loadForms = (): Form[] => {
  const storedForms = localStorage.getItem(FORMS_STORAGE_KEY);
  return storedForms ? JSON.parse(storedForms) : [];
};

// Save forms to storage
const saveForms = (forms: Form[]): void => {
  localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
};

// Load custom field templates from storage
const loadCustomFields = (): CustomFieldTemplate[] => {
  const storedCustomFields = localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
  return storedCustomFields ? JSON.parse(storedCustomFields) : [];
};

// Save custom field templates to storage
const saveCustomFields = (customFields: CustomFieldTemplate[]): void => {
  localStorage.setItem(CUSTOM_FIELDS_STORAGE_KEY, JSON.stringify(customFields));
};

export const formService = {
  // Get all forms
  getForms: async (): Promise<Form[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadForms());
      }, 300); // Simulated delay
    });
  },

  // Get a single form by ID
  getFormById: async (id: string): Promise<Form | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const form = forms.find(f => f.id === id) || null;
        resolve(form);
      }, 300);
    });
  },

  // Create a new form
  createForm: async (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Promise<Form> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const now = new Date().toISOString();
        
        const newForm: Form = {
          ...formData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          fields: formData.fields || []
        };
        
        forms.push(newForm);
        saveForms(forms);
        resolve(newForm);
      }, 300);
    });
  },

  // Update an existing form
  updateForm: async (id: string, formData: Partial<Omit<Form, 'id' | 'createdAt'>>): Promise<Form | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const index = forms.findIndex(f => f.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const updatedForm: Form = {
          ...forms[index],
          ...formData,
          updatedAt: new Date().toISOString()
        };
        
        forms[index] = updatedForm;
        saveForms(forms);
        resolve(updatedForm);
      }, 300);
    });
  },

  // Delete a form
  deleteForm: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const filteredForms = forms.filter(f => f.id !== id);
        
        if (filteredForms.length === forms.length) {
          resolve(false);
          return;
        }
        
        saveForms(filteredForms);
        resolve(true);
      }, 300);
    });
  },

  // Add a field to a form
  addField: async (formId: string, field: Omit<FormField, 'id'>): Promise<Form | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const index = forms.findIndex(f => f.id === formId);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const newField: FormField = {
          ...field,
          id: generateId()
        };
        
        forms[index].fields.push(newField);
        forms[index].updatedAt = new Date().toISOString();
        
        saveForms(forms);
        resolve(forms[index]);
      }, 300);
    });
  },

  // Update a field in a form
  updateField: async (formId: string, fieldId: string, fieldData: Partial<FormField>): Promise<Form | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const formIndex = forms.findIndex(f => f.id === formId);
        
        if (formIndex === -1) {
          resolve(null);
          return;
        }
        
        const fieldIndex = forms[formIndex].fields.findIndex(f => f.id === fieldId);
        
        if (fieldIndex === -1) {
          resolve(null);
          return;
        }
        
        forms[formIndex].fields[fieldIndex] = {
          ...forms[formIndex].fields[fieldIndex],
          ...fieldData
        };
        
        forms[formIndex].updatedAt = new Date().toISOString();
        
        saveForms(forms);
        resolve(forms[formIndex]);
      }, 300);
    });
  },

  // Delete a field from a form
  deleteField: async (formId: string, fieldId: string): Promise<Form | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const formIndex = forms.findIndex(f => f.id === formId);
        
        if (formIndex === -1) {
          resolve(null);
          return;
        }
        
        forms[formIndex].fields = forms[formIndex].fields.filter(f => f.id !== fieldId);
        forms[formIndex].updatedAt = new Date().toISOString();
        
        saveForms(forms);
        resolve(forms[formIndex]);
      }, 300);
    });
  },

  // Reorder fields in a form
  reorderFields: async (formId: string, fieldIds: string[]): Promise<Form | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const forms = loadForms();
        const formIndex = forms.findIndex(f => f.id === formId);
        
        if (formIndex === -1) {
          resolve(null);
          return;
        }
        
        const currentFields = [...forms[formIndex].fields];
        const newFields: FormField[] = [];
        
        // Reorder fields based on the order of IDs
        fieldIds.forEach(id => {
          const field = currentFields.find(f => f.id === id);
          if (field) {
            newFields.push(field);
          }
        });
        
        forms[formIndex].fields = newFields;
        forms[formIndex].updatedAt = new Date().toISOString();
        
        saveForms(forms);
        resolve(forms[formIndex]);
      }, 300);
    });
  },

  // Submit a form (would usually send data to the server)
  submitForm: async (formId: string, data: Record<string, any>): Promise<FormSubmission> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would be an API call to your Express backend
        const submission: FormSubmission = {
          id: generateId(),
          formId,
          data,
          submittedAt: new Date().toISOString()
        };
        
        // Here you would typically save the submission to your MongoDB database
        // For now, we just return the submission object
        resolve(submission);
      }, 300);
    });
  },

  // Custom Field Template Methods
  
  // Get all custom field templates
  getCustomFields: async (): Promise<CustomFieldTemplate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadCustomFields());
      }, 300);
    });
  },

  // Get a single custom field template by ID
  getCustomFieldById: async (id: string): Promise<CustomFieldTemplate | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customFields = loadCustomFields();
        const customField = customFields.find(f => f.id === id) || null;
        resolve(customField);
      }, 300);
    });
  },

  // Create a new custom field template
  createCustomField: async (data: Omit<CustomFieldTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomFieldTemplate> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customFields = loadCustomFields();
        const now = new Date().toISOString();
        
        const newCustomField: CustomFieldTemplate = {
          ...data,
          id: generateId(),
          createdAt: now,
          updatedAt: now
        };
        
        customFields.push(newCustomField);
        saveCustomFields(customFields);
        resolve(newCustomField);
      }, 300);
    });
  },

  // Update an existing custom field template
  updateCustomField: async (id: string, data: Partial<Omit<CustomFieldTemplate, 'id' | 'createdAt'>>): Promise<CustomFieldTemplate | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customFields = loadCustomFields();
        const index = customFields.findIndex(f => f.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const updatedCustomField: CustomFieldTemplate = {
          ...customFields[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        customFields[index] = updatedCustomField;
        saveCustomFields(customFields);
        resolve(updatedCustomField);
      }, 300);
    });
  },

  // Delete a custom field template
  deleteCustomField: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customFields = loadCustomFields();
        const filteredCustomFields = customFields.filter(f => f.id !== id);
        
        if (filteredCustomFields.length === customFields.length) {
          resolve(false);
          return;
        }
        
        saveCustomFields(filteredCustomFields);
        resolve(true);
      }, 300);
    });
  }
};
