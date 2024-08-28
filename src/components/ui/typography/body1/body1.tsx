import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Body1 = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  return (
    <p
      {...props}
      ref={ref}
      className={cn('text-base text-black', props.className)}
    >
      {props.children}
    </p>
  );
});

Body1.displayName = 'Body1';
export { Body1 };
