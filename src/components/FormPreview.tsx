import { FC, useState } from 'react';
import { Form, FormField } from '@/types/formTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Flame } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FormPreviewProps {
  form: Form;
}

const FormPreview: FC<FormPreviewProps> = ({ form }) => {
  return (
    <Card className="w-full glass-panel animate-slide-in">
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        {form.description && <CardDescription>{form.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="flex items-center">
                {field.label}
                {field.required && <span className="ml-1 text-destructive">*</span>}
              </Label>
              
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              
              {renderField(field)}
            </div>
          ))}
          
          {form.fields.length > 0 && (
            <Button type="submit" className="w-full btn-hover-slide mt-6">
              Submit
            </Button>
          )}
          
          {form.fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Add fields to see a preview of your form</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

const NaturalGasInputField: FC<{ field: FormField }> = ({ field }) => {
  const [values, setValues] = useState({
    value: '',
    units: '',
    type: '',
    stage: '',
    use: ''
  });

  const handleChange = (subField: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [subField]: value
    }));
  };

  return (
    <Card className="border border-muted p-4">
      <div className="flex items-center mb-2">
        <Flame size={16} className="mr-2 text-orange-500" />
        <h3 className="text-sm font-medium">Natural Gas Input</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor={`${field.id}-value`} className="text-xs">Value</Label>
          <Input
            id={`${field.id}-value`}
            type="number"
            value={values.value}
            onChange={(e) => handleChange('value', e.target.value)}
            className="mt-1"
            placeholder="Enter value"
          />
        </div>

        <div>
          <Label htmlFor={`${field.id}-units`} className="text-xs">Units</Label>
          <Select
            value={values.units}
            onValueChange={(value) => handleChange('units', value)}
          >
            <SelectTrigger id={`${field.id}-units`} className="mt-1">
              <SelectValue placeholder="Select units" />
            </SelectTrigger>
            <SelectContent>
              {field.subFieldOptions?.units?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`${field.id}-type`} className="text-xs">Type</Label>
          <Select
            value={values.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id={`${field.id}-type`} className="mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {field.subFieldOptions?.types?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`${field.id}-stage`} className="text-xs">Stage</Label>
          <Select
            value={values.stage}
            onValueChange={(value) => handleChange('stage', value)}
          >
            <SelectTrigger id={`${field.id}-stage`} className="mt-1">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {field.subFieldOptions?.stages?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`${field.id}-use`} className="text-xs">Use</Label>
          <Select
            value={values.use}
            onValueChange={(value) => handleChange('use', value)}
          >
            <SelectTrigger id={`${field.id}-use`} className="mt-1">
              <SelectValue placeholder="Select use" />
            </SelectTrigger>
            <SelectContent>
              {field.subFieldOptions?.uses?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

const ArrayField: FC<{ field: FormField, type: 'text' | 'number' }> = ({ field, type }) => {
  const [items, setItems] = useState<string[]>([""]);
  
  const addItem = () => {
    setItems([...items, ""]);
  };
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };
  
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type={type}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={field.placeholder}
            className="flex-grow"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="h-9 w-9"
            disabled={items.length <= 1}
          >
            <X size={16} />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full"
        disabled={field.validations?.maxItems ? items.length >= field.validations.maxItems : false}
      >
        <Plus size={16} className="mr-2" />
        Add Item
      </Button>
    </div>
  );
};

const renderField = (field: FormField) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <Input
          id={field.id}
          type={field.type}
          placeholder={field.placeholder}
          className="w-full"
          required={field.required}
        />
      );
    
    case 'number':
      return (
        <Input
          id={field.id}
          type="number"
          placeholder={field.placeholder}
          min={field.validations?.min}
          max={field.validations?.max}
          className="w-full"
          required={field.required}
        />
      );
    
    case 'textarea':
      return (
        <Textarea
          id={field.id}
          placeholder={field.placeholder}
          className="w-full"
          required={field.required}
        />
      );
    
    case 'select':
      return (
        <Select>
          <SelectTrigger id={field.id}>
            <SelectValue placeholder={field.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'multiSelect':
      // For simplicity, we're using the same Select component
      // In a real app, you'd use a component that supports multiple selections
      return (
        <Select>
          <SelectTrigger id={field.id}>
            <SelectValue placeholder={field.placeholder || "Select options"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'checkbox':
      return (
        <Checkbox
          id={field.id}
          required={field.required}
        />
      );
    
    case 'textArray':
      return <ArrayField field={field} type="text" />;
      
    case 'numberArray':
      return <ArrayField field={field} type="number" />;
    
    case 'date':
      return (
        <Input
          id={field.id}
          type="date"
          className="w-full"
          required={field.required}
        />
      );
      
    case 'naturalGasInput':
      return <NaturalGasInputField field={field} />;
    
    default:
      return (
        <Input
          id={field.id}
          placeholder={field.placeholder}
          className="w-full"
          required={field.required}
        />
      );
  }
};

export default FormPreview;
