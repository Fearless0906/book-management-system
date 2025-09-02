import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function EmptyState({ title, description, icon: Icon, buttonText, onButtonClick }: EmptyStateProps) {
  return (
    <Card className="p-8">
      <div className="text-center py-12">
        <Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        {buttonText && onButtonClick && (
          <Button onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </div>
    </Card>
  );
}