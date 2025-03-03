
import { FC, useState } from 'react';
import { FormField } from '@/types/formTypes';
import { 
  GripVertical, 
  Trash2, 
  Type, 
  Hash, 
  List, 
  CheckSquare, 
  AlignLeft, 
  Mail, 
  LockKeyhole, 
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DraggableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
}

const getFieldIcon = (type: string) => {
  switch (type) {
    case 'text':
      return <Type size={16} />;
    case 'number':
      return <Hash size={16} />;
    case 'select':
      return <List size={16} />;
    case 'multiSelect':
      return <List size={16} />;
    case 'checkbox':
      return <CheckSquare size={16} />;
    case 'textArray':
      return <AlignLeft size={16} />;
    case 'email':
      return <Mail size={16} />;
    case 'password':
      return <LockKeyhole size={16} />;
    case 'date':
      return <Calendar size={16} />;
    case 'textarea':
      return <AlignLeft size={16} />;
    default:
      return <Type size={16} />;
  }
};

const DraggableField: FC<DraggableFieldProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, field.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  return (
    <div
      className={cn(
        'form-field',
        isSelected && 'form-field-selected',
        isDragging && 'opacity-50',
        'animate-fade-in'
      )}
      onClick={onSelect}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
      aria-selected={isSelected}
    >
      <div className="field-drag-handle">
        <GripVertical size={16} />
      </div>
      
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center mb-1">
            <span className="field-type-icon">{getFieldIcon(field.type)}</span>
            <span className="font-medium">{field.label}</span>
            {field.required && <span className="ml-1 text-destructive">*</span>}
          </div>
          
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          
          <div className="mt-2 text-xs text-muted-foreground">
            Type: <span className="font-semibold">{field.type}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete field"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default DraggableField;
