import * as React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

import { BiomarkerCard } from '../biomarker-card/biomarker-card';

export function BiomarkerTableDialogRow({
  children,
  biomarker,
}: any): JSX.Element {
  const { width } = useWindowDimensions();
  if (width <= 768) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="inset-x-0 bottom-0 h-full max-h-[96%] outline-none">
          <div className="w-full overflow-auto">
            <BiomarkerCard biomarker={biomarker} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <BiomarkerCard biomarker={biomarker} />
      </DialogContent>
    </Dialog>
  );
}
