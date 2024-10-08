import { X } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Body2, H2 } from '@/components/ui/typography';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

import { AddAddressForm } from './add-address-form';

export function AddAddressDialog({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);

  if (width <= 768) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="flex max-h-full flex-col rounded-t-[10px]">
          <div className="flex items-center justify-between px-4 pt-16">
            <SheetClose>
              <div className="flex h-[44px] min-w-[44px] items-center justify-center rounded-full bg-zinc-100 ">
                <X className="h-4 min-w-4" />
              </div>
            </SheetClose>
            <Body2>Add an address</Body2>
            <div className="min-w-[44px]" />
          </div>
          <div className="overflow-auto p-6">
            <AddAddressForm onSuccess={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-14">
        <H2>Add an address</H2>
        <AddAddressForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
