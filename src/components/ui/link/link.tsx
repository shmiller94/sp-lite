import { Link as RouterLink } from '@tanstack/react-router';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type LinkProps = ComponentProps<typeof RouterLink>;

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn('text-slate-600 hover:text-slate-900', className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
