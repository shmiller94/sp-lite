import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const OnboardingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type, ...props }, ref) => {
    return (
      <div>
        <div className="relative left-4 top-8 size-3 text-white">{icon}</div>
        <input
          type={type}
          className={cn(
            'flex w-full border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-14 rounded-xl border-white/20 bg-white/5 p-4 text-[16px] font-normal text-white caret-white placeholder:text-white placeholder:opacity-50 focus:border-white',
            className,
            icon !== undefined ? 'pl-12' : '',
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
OnboardingInput.displayName = 'OnboardingInput';

export { OnboardingInput };
