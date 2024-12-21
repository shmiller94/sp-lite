import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { PlansList } from '@/features/rdns/components/plans-list';
import { useCurrentPatient } from '@/features/rdns/hooks/use-current-patient';
import { User } from '@/types/api';

export const ActionCell = ({ patient }: { patient: User }) => {
  const { setPatient } = useCurrentPatient();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  return (
    <Dialog>
      <DropdownMenu
        open={open}
        onOpenChange={() => {
          setPatient(patient);
          setOpen((prev) => !prev);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal width={16} height={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigate('/data');
            }}
          >
            Data
          </DropdownMenuItem>
          <PlansList />
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
};
