import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const H1 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => {
  return (
    <h1
      {...props}
      ref={ref}
      className={cn(
        'text-3xl md:text-6xl tracking-[-1.6px] text-black font-normal',
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
});

H1.displayName = 'H1';
export { H1 };
