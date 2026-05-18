import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadingProps {
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ fullScreen, className }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center p-4',
        fullScreen ? 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm' : '',
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
};
