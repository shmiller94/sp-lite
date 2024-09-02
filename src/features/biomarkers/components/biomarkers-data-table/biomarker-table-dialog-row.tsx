import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { BiomarkerCard } from '../biomarker-card/biomarker-card';

export function BiomarkerTableDialogRow({
  children,
  biomarker,
}: any): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <BiomarkerCard biomarker={biomarker} />
      </DialogContent>
    </Dialog>
  );
}
