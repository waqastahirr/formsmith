
import { FC } from 'react';
import FormBuilder from '@/components/FormBuilder';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="container mx-auto py-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">FormSmith</h1>
          <p className="text-lg text-muted-foreground">
            Create beautiful, functional forms with an intuitive drag-and-drop builder
          </p>
          <div className="flex justify-center mt-4">
            <Button asChild variant="outline" className="mr-2">
              <Link to="/custom-fields">Custom Field Builder</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto pb-16 px-4">
        <FormBuilder />
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>FormSmith ∙ Build forms with ease</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
