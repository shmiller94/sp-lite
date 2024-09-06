import { Loader } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogClose } from '@/components/ui/dialog';
import { useDeleteFile } from '@/features/files/api/delete-file';

export function ConfirmDelete({ fileId }: { fileId: string }) {
  const { mutateAsync, isPending } = useDeleteFile();

  const onFileDelete = async (fileId: string): Promise<void> => {
    await mutateAsync({ fileId });
  };

  return (
    <DialogContent className="w-full max-w-[432px] space-y-8 p-9 md:p-12">
      <h1 className="text-center text-2xl text-[#18181B]">
        Are you sure you want to delete this file? This action cannot be undone.
      </h1>
      <div className="mx-auto flex w-full items-center justify-center gap-4">
        <DialogClose asChild>
          <Button variant="outline" className="px-8 py-4">
            Cancel
          </Button>
        </DialogClose>
        <Button
          className="text-nowrap px-8 py-4"
          onClick={() => onFileDelete(fileId)}
        >
          {isPending ? <Loader /> : 'Confirm Delete'}
        </Button>
      </div>
    </DialogContent>
  );
}
