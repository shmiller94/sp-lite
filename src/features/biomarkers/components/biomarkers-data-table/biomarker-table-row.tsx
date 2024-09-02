import { ReactNode } from 'react';

import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export function BiomarkerTableRow({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}): JSX.Element {
  return (
    <TableRow
      className={cn(
        'w-full border border-gray-200 cursor-pointer [&>*:first-child]:rounded-l-[16px] [&>*:last-child]:rounded-r-[16px] [&>*:last-child]:p-3 bg-white hover:bg-white hover:bg-opacity-50',
      )}
      onClick={onClick}
    >
      {children}
    </TableRow>
  );
}
