import { ReactNode } from 'react';

import { TableHead } from '@/components/ui/table';

export function BiomarkerTableHead({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <TableHead
      className={'h-2 text-nowrap font-normal text-zinc-400 md:text-base'}
    >
      {children}
    </TableHead>
  );
}
