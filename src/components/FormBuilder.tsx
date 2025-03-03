
import { useState, useEffect } from 'react';
import { Form, FormField, FieldType } from '@/types/formTypes';
import { formService } from '@/services/formService';
import DraggableField from './DraggableField';
import FormFieldOptions from './FormFieldOptions';
import FormPreview from './FormPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Plus, 
  Eye, 
  Settings, 
  List, 
  Type, 
  Hash, 
  AlignLeft, 
  Mail,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const fieldTypes: { type: FieldType; label: string; icon: JSX.Element }[] = [
  { type: 'text', label: 'Text', icon: <Type size={16} /> },
  { type: 'number', label: 'Number', icon: <Hash size={16} /> },
  { type: 'select', label: 'Select', icon: <List size={16} /> },
  { type: 'textarea', label: 'Text Area', icon: <AlignLeft size={16} /> },
  { type: 'email', label: 'Email', icon: <Mail size={16} /> },
  { type: 'date', label: 'Date', icon: <Calendar size={16} /> },
];

const initialForm: Form = {
  id: '',
  name: 'New Form',
  description: '',
  fields: [],
  createdAt: '',
  updatedAt: '',
  isPublished: false,
};

const generateEmptyField = (type: FieldType): Omit<FormField, 'id'> => ({
  type,
  label: `New ${type} field`,
  required: false,
  options: type === 'select' || type === 'multiSelect' ? [] : undefined,
  validations: {}
});

const FormBuilder = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<Form>({ ...initialForm });
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('fields');

  const selectedField = form.fields.find(f => f.id === selectedFieldId) || null;

  const handleFormChange = (key: keyof Form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddField = async (type: FieldType) => {
    try {
      const emptyField = generateEmptyField(type);
      const updatedForm = await formService.addField(form.id, emptyField);
      
      if (updatedForm) {
        setForm(updatedForm);
        
        // Select the newly added field
        const newFieldId = updatedForm.fields[updatedForm.fields.length - 1].id;
        setSelectedFieldId(newFieldId);
        
        toast({
          title: 'Field added',
          description: `Added a new ${type} field`,
        });
      }
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: 'Error',
        description: 'Failed to add field',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateField = async (updatedField: FormField) => {
    try {
      const updatedForm = await formService.updateField(
        form.id,
        updatedField.id,
        updatedField
      );
      
      if (updatedForm) {
        setForm(updatedForm);
      }
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: 'Error',
        description: 'Failed to update field',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      const updatedForm = await formService.deleteField(form.id, fieldId);
      
      if (updatedForm) {
        setForm(updatedForm);
        
        // If the deleted field was selected, clear the selection
        if (selectedFieldId === fieldId) {
          setSelectedFieldId(null);
        }
        
        toast({
          title: 'Field deleted',
          description: 'Field has been removed',
        });
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete field',
        variant: 'destructive',
      });
    }
  };

  const handleSaveForm = async () => {
    try {
      setIsSaving(true);
      
      let updatedForm;
      if (form.id) {
        // Update existing form
        updatedForm = await formService.updateForm(form.id, {
          name: form.name,
          description: form.description,
          fields: form.fields,
          isPublished: form.isPublished,
        });
      } else {
        // Create new form
        updatedForm = await formService.createForm({
          name: form.name,
          description: form.description,
          fields: form.fields,
          isPublished: false,
        });
      }
      
      if (updatedForm) {
        setForm(updatedForm);
        
        toast({
          title: 'Form saved',
          description: 'Your form has been saved successfully',
        });
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save form',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedFieldId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedFieldId || draggedFieldId === targetId) {
      return;
    }
    
    const newFields = [...form.fields];
    const draggedIndex = newFields.findIndex(f => f.id === draggedFieldId);
    const targetIndex = newFields.findIndex(f => f.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedField] = newFields.splice(draggedIndex, 1);
      newFields.splice(targetIndex, 0, draggedField);
      
      const fieldIds = newFields.map(f => f.id);
      const updatedForm = await formService.reorderFields(form.id, fieldIds);
      
      if (updatedForm) {
        setForm(updatedForm);
      }
    }
    
    setDraggedFieldId(null);
  };

  // Create a new form when component mounts if no ID is present
  useEffect(() => {
    const createInitialForm = async () => {
      if (!form.id) {
        try {
          const newForm = await formService.createForm({
            name: 'New Form',
            description: '',
            fields: [],
            isPublished: false,
          });
          
          setForm(newForm);
        } catch (error) {
          console.error('Error creating form:', error);
        }
      }
    };
    
    createInitialForm();
  }, []);

  return (
    <div className="w-full">
      <Card className="mb-6 glass-panel animate-fade-in">
        <CardHeader>
          <CardTitle>
            <Input
              value={form.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="text-2xl font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Form Title"
            />
          </CardTitle>
          <CardDescription>
            <Textarea
              value={form.description || ''}
              onChange={(e) => handleFormChange('description', e.target.value)}
              className="border-0 bg-transparent p-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Form Description (optional)"
            />
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSaveForm} 
            disabled={isSaving}
            className="btn-hover-slide"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Form'}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="fields" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Form Fields
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="animate-fade-in">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Form Fields</CardTitle>
                  <CardDescription>
                    Drag and drop to reorder fields
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {fieldTypes.map((field) => (
                      <Button
                        key={field.type}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddField(field.type)}
                        className="flex items-center btn-hover-slide"
                      >
                        <span className="mr-1">{field.icon}</span>
                        {field.label}
                      </Button>
                    ))}
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    {form.fields.length === 0 ? (
                      <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                        <p>Click the buttons above to add form fields</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {form.fields.map((field) => (
                          <DraggableField
                            key={field.id}
                            field={field}
                            isSelected={selectedFieldId === field.id}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onDelete={() => handleDeleteField(field.id)}
                            onDragStart={handleDragStart}
                            onDragEnd={() => setDraggedFieldId(null)}
                            onDragOver={(e) => {
                              handleDragOver(e);
                              if (draggedFieldId && draggedFieldId !== field.id) {
                                handleDrop(field.id);
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <FormPreview form={form} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-4">
          <Card className="glass-panel animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Field Properties
              </CardTitle>
              <CardDescription>
                {selectedField ? 'Configure the selected field' : 'Select a field to configure its properties'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedField ? (
                <FormFieldOptions
                  field={selectedField}
                  onUpdate={handleUpdateField}
                />
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No field selected</p>
                  <Button 
                    className="mt-4 btn-hover-slide"
                    onClick={() => handleAddField('text')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Text Field
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
