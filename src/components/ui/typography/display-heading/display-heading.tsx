import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const DisplayH = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => {
  return (
    <h1
      {...props}
      ref={ref}
      className={cn(
        'text-9xl font-normal text-black tracking-display-heading',
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
});

DisplayH.displayName = 'DisplayH';
export { DisplayH };
