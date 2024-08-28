import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const H3 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => {
  return (
    <h3
      {...props}
      ref={ref}
      className={cn(
        'text-2xl tracking-[-0.48px] text-black font-normal',
        props.className,
      )}
    >
      {props.children}
    </h3>
  );
});

H3.displayName = 'H3';
export { H3 };
