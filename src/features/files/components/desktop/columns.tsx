import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import { ViewPdfDialog } from '@/features/files/components/file-dialogs/view-pdf-dialog';
import { cn } from '@/lib/utils';
import { File } from '@/types/api';

import { CONTENT_TYPE_MAP } from '../../const/content-type';
import { FileDropdown } from '../patterns/file-dropdown';
import { FileName } from '../patterns/file-name';

// TODO: Enable source, category, and status columns
export const columns: ColumnDef<File>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-sm hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          File
          <ChevronDown
            className={cn(
              `ml-0.5 size-[15px] transition-transform duration-300 ease-in-out`,
              column.getIsSorted() === 'asc' ? 'rotate-180' : '',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.contentType === 'application/pdf') {
        return (
          <ViewPdfDialog file={row.original}>
            <div className="flex w-full cursor-pointer items-center place-self-start md:max-w-[280px] lg:max-w-[400px] xl:max-w-none">
              <FileName file={row.original} />
            </div>
          </ViewPdfDialog>
        );
      }

      return (
        <div className="flex w-full items-center md:max-w-[280px] lg:max-w-[400px] xl:max-w-none">
          <FileName file={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: 'contentType',
    header: 'Type',
    cell: ({ row }) => {
      /* Maps content type to a human readable string if it exists */
      const type =
        CONTENT_TYPE_MAP[row.original.contentType] || row.original.contentType;

      return (
        <div className="hidden xl:table-cell">
          <span>{type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'uploadedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-sm hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ChevronDown
            className={cn(
              `ml-0.5 size-[15px] transition-transform duration-300 ease-in-out`,
              column.getIsSorted() === 'asc' ? 'rotate-180' : '',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{moment(row.original.uploadedAt).format('MMM D, YYYY')}</div>;
    },
  },
  {
    id: 'action',
    header: () => {
      return <div className="text-right"></div>;
    },
    cell: ({ row }) => {
      return (
        <div className="-mb-1 flex items-center justify-end">
          <FileDropdown file={row.original}>
            <Button
              variant="ghost"
              size="icon"
              // -mt-1 class to offset the -mb-1 class on the parent to visually align the button with the other cells
              className="-mt-1 rounded-lg p-2 data-[state=open]:bg-zinc-100"
            >
              <MoreHorizontal className="size-4 text-zinc-500" />
              <span className="sr-only">Open menu</span>
            </Button>
          </FileDropdown>
        </div>
      );
    },
  },
];
