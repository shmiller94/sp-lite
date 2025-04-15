import { X } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/components/ui/sonner';
import { Body2, H2 } from '@/components/ui/typography';
import { FormAddressInput, useEditAddress } from '@/features/users/api';
import { useCreateAddress } from '@/features/users/api/create-address';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import { ActiveAddress, Address } from '@/types/api';

import { AddressForm } from './address-form';

interface AddressDialogProps {
  children: ReactNode | ((props: { onClick: () => void }) => ReactNode);
  mode: 'add' | 'edit';
  address?: ActiveAddress;
  onSuccess?: () => void;
}

export function AddressDialog({
  children,
  mode,
  address,
  onSuccess,
}: AddressDialogProps) {
  const { width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);

  const createAddressMutation = useCreateAddress({
    mutationConfig: {
      onSuccess: () => {
        handleDialogClose();
        toast.success('Address added successfully');
      },
      onError: (error) => {
        toast.error(`Failed to add address. Please try again.`);
        console.error(`Failed to add address:`, error);
      },
    },
  });

  const editAddressMutation = useEditAddress({
    mutationConfig: {
      onSuccess: () => {
        handleDialogClose();
        toast.success('Address edited successfully');
      },
      onError: (error) => {
        toast.error(`Failed to edit address. Please try again.`);
        console.error(`Failed to edit address:`, error);
      },
    },
  });

  const title = mode === 'add' ? 'Add an address' : 'Edit address';

  const defaultValues: FormAddressInput | undefined = address
    ? {
        line1: address.address.line[0] || '',
        line2: address.address.line[1] || '',
        city: address.address.city || '',
        state: address.address.state || '',
        postalCode: address.address.postalCode || '',
        text: address.address.text,
      }
    : undefined;

  const handleDialogClose = () => {
    setIsOpen(false);
    if (onSuccess) onSuccess();
  };

  const handleFormSubmit = async (data: FormAddressInput) => {
    if (mode === 'edit' && address) {
      // Update existing address
      const updatedAddress: ActiveAddress = {
        ...address,
        address: {
          ...address.address,
          line: [data.line1, data.line2 || ''].filter(
            (line) => line.length > 0,
          ),
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          text: data.text,
        },
      };

      await editAddressMutation.mutateAsync({
        data: {
          activeAddress: updatedAddress,
        },
      });
    } else {
      const newAddress: Address = {
        line: [data.line1, data.line2 || ''].filter((line) => line.length > 0),
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        text: data.text,
      };

      await createAddressMutation.mutateAsync({
        data: {
          address: newAddress,
        },
      });
    }
  };

  if (width <= 768) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {typeof children === 'function'
            ? children({ onClick: () => setIsOpen(true) })
            : children}
        </SheetTrigger>
        <SheetContent className="flex max-h-full flex-col rounded-t-[10px]">
          <div className="flex items-center justify-between px-4 pt-16">
            <SheetClose>
              <div className="flex h-[44px] min-w-[44px] items-center justify-center rounded-full bg-zinc-100">
                <X className="h-4 min-w-4" />
              </div>
            </SheetClose>
            <Body2>{title}</Body2>
            <div className="min-w-[44px]" />
          </div>
          <div className="overflow-auto p-6">
            <AddressForm
              mode={mode}
              onFormSubmit={handleFormSubmit}
              defaultValues={defaultValues}
              onSuccess={handleDialogClose}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {typeof children === 'function'
          ? children({ onClick: () => setIsOpen(true) })
          : children}
      </DialogTrigger>
      <DialogContent className="p-14">
        <H2>{title}</H2>
        <AddressForm
          mode={mode}
          onFormSubmit={handleFormSubmit}
          defaultValues={defaultValues}
          onSuccess={handleDialogClose}
        />
      </DialogContent>
    </Dialog>
  );
}
