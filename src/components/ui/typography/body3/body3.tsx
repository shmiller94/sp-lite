import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Body3 = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  return (
    <p
      {...props}
      ref={ref}
      className={cn('text-xs text-black font-normal', props.className)}
    >
      {props.children}
    </p>
  );
});

Body3.displayName = 'Body3';
export { Body3 };
