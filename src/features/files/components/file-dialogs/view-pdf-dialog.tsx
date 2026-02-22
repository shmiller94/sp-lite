import { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PdfViewer } from '@/features/files/components/pdf-viewer';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { File } from '@/types/api';

export const ViewPdfDialog = ({
  file,
  children,
}: {
  file: File;
  children: ReactNode;
}) => {
  const { id, name } = file;
  const { width } = useWindowDimensions();

  if (width <= 768) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex max-h-full flex-col rounded-t-[10px]">
          <SheetTitle className="sr-only">{name}</SheetTitle>
          <SheetDescription className="sr-only">
            PDF document viewer.
          </SheetDescription>
          <PdfViewer id={id} name={name} />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-full max-h-[calc(100vh-48px)]">
        <DialogTitle className="sr-only">{name}</DialogTitle>
        <DialogDescription className="sr-only">
          PDF document viewer.
        </DialogDescription>
        <PdfViewer id={id} name={name} />
      </DialogContent>
    </Dialog>
  );
};
