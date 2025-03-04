
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formService } from '@/services/formService';
import { CustomFieldTemplate, FormField } from '@/types/formTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Save, X } from 'lucide-react';
import FormFieldOptions from '@/components/FormFieldOptions';
import FormPreview from '@/components/FormPreview';

const CustomFieldBuilder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCustomField, setSelectedCustomField] = useState<CustomFieldTemplate | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCustomField, setNewCustomField] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: ''
  });
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Query custom fields
  const { data: customFields = [], isLoading: isLoadingCustomFields } = useQuery({
    queryKey: ['customFields'],
    queryFn: formService.getCustomFields
  });

  // Mutations
  const createCustomFieldMutation = useMutation({
    mutationFn: formService.createCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] });
      toast({
        title: 'Success',
        description: 'Custom field created successfully',
      });
      setIsCreateDialogOpen(false);
      setNewCustomField({ name: '', description: '' });
      setFields([]);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create custom field',
        variant: 'destructive',
      });
    }
  });

  const updateCustomFieldMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomFieldTemplate> }) => 
      formService.updateCustomField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] });
      toast({
        title: 'Success',
        description: 'Custom field updated successfully',
      });
      setSelectedCustomField(null);
      setIsEditMode(false);
      setFields([]);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update custom field',
        variant: 'destructive',
      });
    }
  });

  const deleteCustomFieldMutation = useMutation({
    mutationFn: formService.deleteCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] });
      toast({
        title: 'Success',
        description: 'Custom field deleted successfully',
      });
      setSelectedCustomField(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete custom field',
        variant: 'destructive',
      });
    }
  });

  useEffect(() => {
    if (selectedCustomField && isEditMode) {
      setFields(selectedCustomField.fields || []);
    }
  }, [selectedCustomField, isEditMode]);

  // Add a new field to the custom field template
  const handleAddField = () => {
    const newField: FormField = {
      id: `temp-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: '',
    };
    
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  // Update a field in the custom field template
  const handleUpdateField = (updatedField: FormField) => {
    setFields(fields.map(field => 
      field.id === updatedField.id ? updatedField : field
    ));
  };

  // Delete a field from the custom field template
  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  // Handle custom field selection
  const handleSelectCustomField = (id: string) => {
    const field = customFields.find(f => f.id === id);
    if (field) {
      setSelectedCustomField(field);
      setIsEditMode(false);
    }
  };

  // Handle saving a custom field template
  const handleSaveCustomField = () => {
    if (isEditMode && selectedCustomField) {
      updateCustomFieldMutation.mutate({
        id: selectedCustomField.id,
        data: {
          name: selectedCustomField.name,
          description: selectedCustomField.description,
          fields: fields
        }
      });
    } else {
      createCustomFieldMutation.mutate({
        name: newCustomField.name,
        description: newCustomField.description,
        fields: fields
      });
    }
  };

  // Preview form for the custom field
  const previewForm: any = selectedCustomField ? {
    id: selectedCustomField.id,
    name: selectedCustomField.name,
    description: selectedCustomField.description,
    fields: isEditMode ? fields : selectedCustomField.fields,
    createdAt: selectedCustomField.createdAt,
    updatedAt: selectedCustomField.updatedAt,
    isPublished: true
  } : {
    id: 'preview',
    name: newCustomField.name,
    description: newCustomField.description,
    fields: fields,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Custom Fields</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditMode(false);
              setSelectedCustomField(null);
              setFields([]);
              setSelectedFieldId(null);
              setNewCustomField({ name: '', description: '' });
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Custom Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Custom Field</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCustomField.name}
                    onChange={(e) => setNewCustomField({ ...newCustomField, name: e.target.value })}
                    placeholder="Enter custom field name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newCustomField.description}
                    onChange={(e) => setNewCustomField({ ...newCustomField, description: e.target.value })}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddField}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
              {fields.length > 0 && (
                <Tabs defaultValue="fields" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="fields">Fields</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fields" className="h-[500px] overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 space-y-4">
                        {fields.map((field) => (
                          <Card
                            key={field.id}
                            className={`cursor-pointer ${selectedFieldId === field.id ? 'border-primary' : ''}`}
                            onClick={() => setSelectedFieldId(field.id)}
                          >
                            <CardContent className="p-4 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{field.label}</p>
                                <p className="text-sm text-muted-foreground">{field.type}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteField(field.id);
                                }}
                              >
                                <X size={16} />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="md:col-span-2">
                        {selectedFieldId && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Field Properties</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <FormFieldOptions
                                field={fields.find(f => f.id === selectedFieldId)!}
                                onUpdate={handleUpdateField}
                              />
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <FormPreview form={previewForm} />
                  </TabsContent>
                </Tabs>
              )}
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSaveCustomField} 
                  disabled={!newCustomField.name || fields.length === 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Custom Field
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoadingCustomFields ? (
          <p>Loading custom fields...</p>
        ) : customFields.length === 0 ? (
          <p>No custom fields found. Create one to get started.</p>
        ) : (
          <>
            {/* List of custom fields */}
            <div className="md:col-span-1 space-y-4">
              {customFields.map((customField) => (
                <Card
                  key={customField.id}
                  className={`cursor-pointer ${selectedCustomField?.id === customField.id ? 'border-primary' : ''}`}
                  onClick={() => handleSelectCustomField(customField.id)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{customField.name}</CardTitle>
                    {customField.description && (
                      <CardDescription>{customField.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Selected custom field details */}
            {selectedCustomField && (
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{selectedCustomField.name}</CardTitle>
                      {selectedCustomField.description && (
                        <CardDescription>{selectedCustomField.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {isEditMode ? (
                        <Button onClick={handleSaveCustomField}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      ) : (
                        <Button onClick={() => setIsEditMode(true)}>
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => deleteCustomFieldMutation.mutate(selectedCustomField.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <Tabs defaultValue="fields" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="fields">Fields</TabsTrigger>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="fields" className="h-[500px] overflow-auto">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 space-y-4">
                              {fields.map((field) => (
                                <Card
                                  key={field.id}
                                  className={`cursor-pointer ${selectedFieldId === field.id ? 'border-primary' : ''}`}
                                  onClick={() => setSelectedFieldId(field.id)}
                                >
                                  <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{field.label}</p>
                                      <p className="text-sm text-muted-foreground">{field.type}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteField(field.id);
                                      }}
                                    >
                                      <X size={16} />
                                    </Button>
                                  </CardContent>
                                </Card>
                              ))}
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleAddField}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Field
                              </Button>
                            </div>
                            
                            <div className="md:col-span-2">
                              {selectedFieldId && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Field Properties</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <FormFieldOptions
                                      field={fields.find(f => f.id === selectedFieldId)!}
                                      onUpdate={handleUpdateField}
                                    />
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="preview">
                          <FormPreview form={previewForm} />
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <FormPreview form={previewForm} />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomFieldBuilder;
