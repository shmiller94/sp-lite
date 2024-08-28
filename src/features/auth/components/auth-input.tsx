import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  border: 'top' | 'bottom';
}

const AuthInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type, border = 'top', ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex border border-input items-center p-4 gap-3',
          border === 'top' ? ' rounded-t-lg border-b-0' : ' rounded-b-lg',
        )}
      >
        <div className="">{icon}</div>
        <input
          type={type}
          className={cn(
            'flex w-full caret-vermillion-900 p-0 text-base transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
AuthInput.displayName = 'AuthInput';

export { AuthInput };
