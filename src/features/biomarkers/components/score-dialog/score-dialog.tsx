import { X } from 'lucide-react';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import * as React from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Body2 } from '@/components/ui/typography';
import { ScoreContent } from '@/features/biomarkers/components/score-dialog/score-content';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

export const ScoreDialog = ({
  children,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { width } = useWindowDimensions();

  if (width <= 768) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex max-h-full flex-col rounded-t-[10px]">
          <div className="flex items-center justify-between px-4 pt-16 md:pb-4">
            <SheetClose>
              <div className="flex h-[44px] min-w-[44px] items-center justify-center rounded-full bg-zinc-50">
                <X className="h-4 min-w-4" />
              </div>
            </SheetClose>
            <Body2>Biomarker</Body2>
            <div className="min-w-[44px]" />
          </div>
          <div className="overflow-y-auto">
            <ScoreContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <ScoreContent />
      </DialogContent>
    </Dialog>
  );
};
