import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Mono = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  return (
    <p
      {...props}
      ref={ref}
      className={cn(
        'text-xs text-black font-normal uppercase font-mono',
        props.className,
      )}
    >
      {props.children}
    </p>
  );
});

Mono.displayName = 'Mono';
export { Mono };
