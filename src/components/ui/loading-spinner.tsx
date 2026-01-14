import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  return (
    <div className={cn('flex items-center justify-center gap-1.5', sizeClasses[size], className)}>
      <div
        className={cn(
          'rounded-full bg-primary animate-bounce',
          dotSizes[size]
        )}
        style={{
          animationDelay: '0ms',
          animationDuration: '1s',
        }}
      />
      <div
        className={cn(
          'rounded-full bg-primary animate-bounce',
          dotSizes[size]
        )}
        style={{
          animationDelay: '150ms',
          animationDuration: '1s',
        }}
      />
      <div
        className={cn(
          'rounded-full bg-primary animate-bounce',
          dotSizes[size]
        )}
        style={{
          animationDelay: '300ms',
          animationDuration: '1s',
        }}
      />
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading', size = 'md' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <LoadingSpinner size={size} />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}
