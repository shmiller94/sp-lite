import * as React from 'react';

import { cn } from '@/lib/utils';

import { Body1, H2 } from '../ui/typography';

export const Header = ({
  title,
  description,
  callToAction,
  ...props
}: {
  title: string;
  description?: string;
  callToAction?: React.ReactNode;
} & React.ComponentProps<'section'>) => {
  return (
    <section
      {...props}
      className={cn('flex items-center justify-between gap-6', props.className)}
    >
      <div className="space-y-2">
        <H2>{title}</H2>
        {description && <Body1 className="text-zinc-500">{description}</Body1>}
      </div>
      {callToAction}
    </section>
  );
};
