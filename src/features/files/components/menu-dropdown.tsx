import { ReactNode } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useDownloadFile } from '@/features/files/api/download-file';
import { ConfirmDelete } from '@/features/files/components/confirm-delete';
import { PdfViewer } from '@/features/files/components/pdf-viewer';
import { downloadBlob } from '@/features/files/utils/download-blob';
import { File } from '@/types/api';

interface MenuDropdownProps {
  children: ReactNode;
  file: File;
}

export function MenuDropdown({
  children,
  file,
}: MenuDropdownProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px] rounded-[16px] border-none"
      >
        <DownloadMenuItem {...file} />
        {file.contentType === 'application/pdf' && <ViewMenuItem {...file} />}
        <DeleteMenuItem {...file} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DownloadMenuItem({ id, name }: File): JSX.Element {
  const { mutateAsync } = useDownloadFile();

  const onClick = async (): Promise<void> => {
    const blob = await mutateAsync({ fileId: id });

    downloadBlob(blob, name);
  };

  return (
    <DropdownMenuItem
      onClick={onClick}
      className="cursor-pointer rounded-[12px] p-4 text-base text-[#71717A]"
    >
      Download
    </DropdownMenuItem>
  );
}

function DeleteMenuItem({ id }: File): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
          }}
          className="cursor-pointer rounded-[12px] p-4 text-base text-[#B90090] focus:bg-[#FFF6FD] focus:text-[#B90090]"
        >
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <ConfirmDelete fileId={id} />
    </Dialog>
  );
}

const ViewMenuItem = ({ id, name }: File) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
          }}
          className="cursor-pointer rounded-[12px] p-4 text-base text-[#71717A]"
        >
          View
        </DropdownMenuItem>
      </DialogTrigger>
      <PdfViewer id={id} name={name} />
    </Dialog>
  );
};
