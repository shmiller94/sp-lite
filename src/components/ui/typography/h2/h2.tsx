import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const H2 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => {
  return (
    <h2
      {...props}
      ref={ref}
      className={cn(
        'text-3xl tracking-[-0.64px] text-black font-normal',
        props.className,
      )}
    >
      {props.children}
    </h2>
  );
});

H2.displayName = 'H2';
export { H2 };
