import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Body1 Component
 *
 * This component renders a paragraph element (`<p>`) with the following styles:
 *
 * - Color: #18181b (zinc-900)
 * - Font Family: "NB International Pro"
 * - Font Size: 16px
 * - Font Style: normal
 * - Font Weight: 400
 * - Line Height: 24px (150% of font size)
 *
 * These styles align with the "Product Body/Body 1" design specifications.
 *
 * Additional classes can be passed via the `className` prop to override or extend the default styling.
 *
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - The props for the paragraph element.
 * @param {React.Ref<HTMLParagraphElement>} ref - The ref to the paragraph element.
 * @returns {JSX.Element} The styled paragraph element.
 */
const Body1 = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  return (
    <p
      {...props}
      ref={ref}
      className={cn('text-base text-zinc-900', props.className)}
    >
      {props.children}
    </p>
  );
});

Body1.displayName = 'Body1';
export { Body1 };
