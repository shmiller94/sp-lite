import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Body2 = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  return (
    <p
      {...props}
      ref={ref}
      className={cn('text-sm text-black font-normal', props.className)}
    >
      {props.children}
    </p>
  );
});

Body2.displayName = 'Body2';
export { Body2 };
