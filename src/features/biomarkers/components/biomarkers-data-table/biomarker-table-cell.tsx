import { ReactNode } from 'react';

import { TableCell } from '@/components/ui/table';

export function BiomarkerTableCell({
  children,
  className,
  cellClassName,
}: {
  children: ReactNode;
  className?: string;
  cellClassName?: string;
}): JSX.Element {
  return (
    <TableCell
      className={`min-w-[136px] overflow-hidden px-2 py-6 ${className} ${cellClassName}`}
    >
      {children}
    </TableCell>
  );
}
