import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioGroupItemVariants = cva(
  'aspect-square size-5 rounded-full border border-zinc-200 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-primary data-[state=checked]:border-primary',
        vermillion:
          'text-vermillion-900 data-[state=checked]:border-vermillion-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const radioGroupIndicatorVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      default: '',
      vermillion: 'text-vermillion-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type RadioGroupItemProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> &
  VariantProps<typeof radioGroupItemVariants>;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupItemVariants({ variant }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(radioGroupIndicatorVariants({ variant }))}
      >
        <Circle className="size-3 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
