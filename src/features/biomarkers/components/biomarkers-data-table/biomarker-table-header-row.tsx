import { ReactNode } from 'react';

import { TableRow } from '@/components/ui/table';

export function BiomarkerTableHeaderRow({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <TableRow className="hover:bg-transparent">{children}</TableRow>;
}
