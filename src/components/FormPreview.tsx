
import { FC } from 'react';
import { Form, FormField } from '@/types/formTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      // For simplicity, just showing one input
      // In a real app, you'd create a component that allows adding multiple inputs
      return (
        <div className="space-y-2">
          <Input
            placeholder={field.placeholder || "Add item"}
            className="w-full"
          />
          <Button type="button" variant="outline" size="sm" className="w-full">
            + Add Another
          </Button>
        </div>
      );
    
    case 'date':
      return (
        <Input
          id={field.id}
          type="date"
          className="w-full"
          required={field.required}
        />
      );
    
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
