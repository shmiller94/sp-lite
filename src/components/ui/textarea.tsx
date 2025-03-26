import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import type { TextareaAutosizeProps } from 'react-textarea-autosize';

import { cn } from '@/lib/utils';

const textAreaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border text-base ring-offset-background transition-all duration-150 ease-in-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-input bg-background px-6 py-4 caret-vermillion-900 placeholder:text-muted-foreground focus-visible:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-ring',
        glass:
          'border-white/20 bg-white/5 p-4 text-white caret-white placeholder:text-white placeholder:opacity-50 focus:border-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Custom type that combines our variant props with the TextareaAutosize props
export interface TextareaProps
  extends Omit<TextareaAutosizeProps, 'style'>,
    VariantProps<typeof textAreaVariants> {
  style?: Omit<React.CSSProperties, 'maxHeight' | 'minHeight'> & {
    height?: number;
  };
}

/*
 * Note here: if adding anything lower than text-base it creates weird zoom effect on safari
 * */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(textAreaVariants({ variant, className }), 'resize-none')}
        ref={ref}
        // set style to undefined to preserve functionality and pass typed props
        style={undefined}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
