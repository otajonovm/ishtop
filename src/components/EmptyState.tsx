import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: any;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Search,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="rounded-full bg-gray-50 p-6">
        <Icon className="h-12 w-12 text-gray-300" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500 max-w-sm">{description}</p>}
    </div>
  );
};
