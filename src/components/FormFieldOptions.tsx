
import { FC, useState, useEffect } from 'react';
import { FormField, FieldOption, FieldType } from '@/types/formTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PlusCircle, 
  X, 
  Type, 
  Hash, 
  List, 
  CheckSquare, 
  AlignLeft, 
  Mail,
  LockKeyhole,
  Calendar,
  Flame
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FormFieldOptionsProps {
  field: FormField;
  onUpdate: (updated: FormField) => void;
}

const fieldTypeOptions: { value: FieldType; label: string; icon: JSX.Element }[] = [
  { value: 'text', label: 'Text', icon: <Type size={16} /> },
  { value: 'number', label: 'Number', icon: <Hash size={16} /> },
  { value: 'textarea', label: 'Text Area', icon: <AlignLeft size={16} /> },
  { value: 'select', label: 'Select', icon: <List size={16} /> },
  { value: 'multiSelect', label: 'Multi Select', icon: <List size={16} /> },
  { value: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={16} /> },
  { value: 'textArray', label: 'Text Array', icon: <AlignLeft size={16} /> },
  { value: 'naturalGasInput', label: 'Natural Gas Input', icon: <Flame size={16} /> },
  { value: 'email', label: 'Email', icon: <Mail size={16} /> },
  { value: 'password', label: 'Password', icon: <LockKeyhole size={16} /> },
  { value: 'date', label: 'Date', icon: <Calendar size={16} /> },
];

// Default options for natural gas input subfields
const defaultUnitOptions = [
  { label: 'kWh', value: 'kwh' },
  { label: 'MJ/kg product', value: 'mj_kg_product' },
  { label: 'm³', value: 'm3' },
];

const defaultTypeOptions = [
  { label: 'Conventional', value: 'conventional' },
  { label: 'Standard grid', value: 'standard_grid' },
  { label: 'PV', value: 'pv' },
];

const defaultStageOptions = [
  { label: 'Mixing', value: 'mixing' },
  { label: 'Processing', value: 'processing' },
  { label: 'Packaging', value: 'packaging' },
];

const defaultUseOptions = [
  { label: 'Cooling', value: 'cooling' },
  { label: 'Heat', value: 'heat' },
  { label: 'Power', value: 'power' },
];

const FormFieldOptions: FC<FormFieldOptionsProps> = ({ field, onUpdate }) => {
  const [options, setOptions] = useState<FieldOption[]>(field.options || []);
  const [newOption, setNewOption] = useState({ label: '', value: '' });
  
  const hasOptions = ['select', 'multiSelect'].includes(field.type);
  const isArrayType = ['textArray', 'numberArray'].includes(field.type);
  const isNaturalGasInput = field.type === 'naturalGasInput';

  // Initialize subfield options for natural gas input
  useEffect(() => {
    if (isNaturalGasInput && !field.subFieldOptions) {
      onUpdate({
        ...field,
        subFieldOptions: {
          units: defaultUnitOptions,
          types: defaultTypeOptions,
          stages: defaultStageOptions,
          uses: defaultUseOptions,
        }
      });
    }
  }, [field.type]);

  const handleChange = (key: keyof FormField, value: any) => {
    onUpdate({
      ...field,
      [key]: value
    });
  };

  const handleAddOption = () => {
    if (newOption.label.trim() && newOption.value.trim()) {
      const updatedOptions = [...options, { ...newOption }];
      setOptions(updatedOptions);
      handleChange('options', updatedOptions);
      setNewOption({ label: '', value: '' });
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    handleChange('options', updatedOptions);
  };

  const handleSubFieldOptionsChange = (
    subFieldKey: 'units' | 'types' | 'stages' | 'uses',
    options: FieldOption[]
  ) => {
    onUpdate({
      ...field,
      subFieldOptions: {
        ...field.subFieldOptions,
        [subFieldKey]: options
      }
    });
  };

  const handleAddSubFieldOption = (
    subFieldKey: 'units' | 'types' | 'stages' | 'uses',
    newOption: FieldOption
  ) => {
    if (newOption.label.trim() && newOption.value.trim()) {
      const currentOptions = field.subFieldOptions?.[subFieldKey] || [];
      const updatedOptions = [...currentOptions, { ...newOption }];
      
      handleSubFieldOptionsChange(subFieldKey, updatedOptions);
    }
  };

  const handleRemoveSubFieldOption = (
    subFieldKey: 'units' | 'types' | 'stages' | 'uses',
    index: number
  ) => {
    const currentOptions = field.subFieldOptions?.[subFieldKey] || [];
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    
    handleSubFieldOptionsChange(subFieldKey, updatedOptions);
  };

  useEffect(() => {
    if (!hasOptions && options.length > 0) {
      setOptions([]);
      handleChange('options', []);
    }
  }, [field.type]);

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Field Label</Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-type">Field Type</Label>
          <Select
            value={field.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="field-type">
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              {fieldTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-description">Description (Optional)</Label>
          <Textarea
            id="field-description"
            value={field.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Help text for this field"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder (Optional)</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder || ''}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) => handleChange('required', !!checked)}
          />
          <Label htmlFor="field-required">Required field</Label>
        </div>

        {hasOptions && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <Label className="mb-2 block">Options</Label>
              
              <div className="space-y-3 mb-4">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option.label}
                      className="flex-grow"
                      disabled
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="h-8 w-8"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Option label"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleAddOption}
                  disabled={!newOption.label.trim()}
                  className="h-8 w-8"
                >
                  <PlusCircle size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isNaturalGasInput && (
          <div className="space-y-4 mt-4">
            <h3 className="text-sm font-medium">Natural Gas Input Configuration</h3>
            <Separator />
            
            {/* Units Options */}
            <div className="space-y-2">
              <Label className="mb-2 block text-xs">Units Options</Label>
              {field.subFieldOptions?.units?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option.label}
                    className="flex-grow text-xs"
                    disabled
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubFieldOption('units', index)}
                    className="h-6 w-6"
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add unit option"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ 
                    label: e.target.value, 
                    value: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                  })}
                  className="flex-grow text-xs"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    handleAddSubFieldOption('units', newOption);
                    setNewOption({ label: '', value: '' });
                  }}
                  disabled={!newOption.label.trim()}
                  className="h-6 w-6"
                >
                  <PlusCircle size={12} />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Type Options */}
            <div className="space-y-2">
              <Label className="mb-2 block text-xs">Type Options</Label>
              {field.subFieldOptions?.types?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option.label}
                    className="flex-grow text-xs"
                    disabled
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubFieldOption('types', index)}
                    className="h-6 w-6"
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add type option"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ 
                    label: e.target.value, 
                    value: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                  })}
                  className="flex-grow text-xs"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    handleAddSubFieldOption('types', newOption);
                    setNewOption({ label: '', value: '' });
                  }}
                  disabled={!newOption.label.trim()}
                  className="h-6 w-6"
                >
                  <PlusCircle size={12} />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Stage Options */}
            <div className="space-y-2">
              <Label className="mb-2 block text-xs">Stage Options</Label>
              {field.subFieldOptions?.stages?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option.label}
                    className="flex-grow text-xs"
                    disabled
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubFieldOption('stages', index)}
                    className="h-6 w-6"
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add stage option"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ 
                    label: e.target.value, 
                    value: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                  })}
                  className="flex-grow text-xs"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    handleAddSubFieldOption('stages', newOption);
                    setNewOption({ label: '', value: '' });
                  }}
                  disabled={!newOption.label.trim()}
                  className="h-6 w-6"
                >
                  <PlusCircle size={12} />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Use Options */}
            <div className="space-y-2">
              <Label className="mb-2 block text-xs">Use Options</Label>
              {field.subFieldOptions?.uses?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option.label}
                    className="flex-grow text-xs"
                    disabled
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubFieldOption('uses', index)}
                    className="h-6 w-6"
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add use option"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ 
                    label: e.target.value, 
                    value: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                  })}
                  className="flex-grow text-xs"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    handleAddSubFieldOption('uses', newOption);
                    setNewOption({ label: '', value: '' });
                  }}
                  disabled={!newOption.label.trim()}
                  className="h-6 w-6"
                >
                  <PlusCircle size={12} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {field.type === 'number' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-value">Min Value</Label>
              <Input
                id="min-value"
                type="number"
                value={field.validations?.min ?? ''}
                onChange={(e) => handleChange('validations', { 
                  ...field.validations, 
                  min: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-value">Max Value</Label>
              <Input
                id="max-value"
                type="number"
                value={field.validations?.max ?? ''}
                onChange={(e) => handleChange('validations', { 
                  ...field.validations, 
                  max: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
          </div>
        )}

        {(field.type === 'text' || field.type === 'textarea') && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-length">Min Length</Label>
              <Input
                id="min-length"
                type="number"
                value={field.validations?.minLength ?? ''}
                onChange={(e) => handleChange('validations', { 
                  ...field.validations, 
                  minLength: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-length">Max Length</Label>
              <Input
                id="max-length"
                type="number"
                value={field.validations?.maxLength ?? ''}
                onChange={(e) => handleChange('validations', { 
                  ...field.validations, 
                  maxLength: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
          </div>
        )}

        {isArrayType && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-items">Min Items</Label>
              <Input
                id="min-items"
                type="number"
                value={field.validations?.minItems ?? ''}
                onChange={(e) => handleChange('validations', { 
                  ...field.validations, 
                  minItems: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-items">Max Items</Label>
              <Input
                id="max-items"
                type="number"
                value={field.validations?.maxItems ?? ''}
                onChange={(e) => handleChange('validations', { 
                  ...field.validations, 
                  maxItems: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormFieldOptions;
