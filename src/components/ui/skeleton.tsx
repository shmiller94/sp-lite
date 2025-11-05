import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const skeletonVariants = cva('rounded-md', {
  variants: {
    variant: {
      smooth: 'animate-pulse bg-muted',
      shimmer:
        'relative overflow-hidden bg-zinc-100 before:absolute before:inset-0 before:-translate-x-full before:rotate-45 before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-zinc-200/50 before:to-transparent',
    },
  },
  defaultVariants: {
    variant: 'smooth',
  },
});

function Skeleton({
  className,
  variant = 'smooth',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'smooth' | 'shimmer';
}) {
  return (
    <div
      id="skeleton-loader"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Skeleton };
