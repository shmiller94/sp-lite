import React from 'react';

import { cn } from '@/lib/utils';

export interface RangeSelectButtonProps {
  icon: React.ReactElement;
  onClick: () => void;
}

export function RangeSelectButton(props: RangeSelectButtonProps): JSX.Element {
  return (
    <button
      className={cn('h-auto flex items-center justify-center rounded-[8px]')}
      onClick={props.onClick}
    >
      <div className="mx-1 size-4 shrink-0">{props.icon}</div>
    </button>
  );
}
