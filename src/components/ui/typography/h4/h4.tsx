import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const H4 = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => {
  return (
    <h4
      {...props}
      ref={ref}
      className={cn(
        'text-xl tracking-[-0.2px] text-black font-normal',
        props.className,
      )}
    >
      {props.children}
    </h4>
  );
});

H4.displayName = 'H4';
export { H4 };
