import { Column } from '@tanstack/react-table';
import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>): JSX.Element {
  return (
    <div className={cn('flex flex-grow', className)}>
      <span className="block max-w-full overflow-hidden truncate text-zinc-400">
        {title}
      </span>
    </div>
  );
}
