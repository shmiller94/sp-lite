import { cva, type VariantProps } from 'class-variance-authority';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import { capitalize } from '@/utils/format';

// TODO: Verify colors here
const orderStatusBadgeVariants = cva(
  'm-0 inline-block px-2.5 py-1 text-sm text-primary',
  {
    variants: {
      variant: {
        upcoming: 'bg-vermillion-100 hover:bg-vermillion-100/70',
        completed: 'bg-green-50 hover:bg-green-50/70',
        cancelled: 'bg-zinc-200 hover:bg-zinc-200/70',
      },
    },
    defaultVariants: {
      variant: 'upcoming',
    },
  },
);

export interface OrderStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof orderStatusBadgeVariants> {
  actions: { label: string; onClick: () => void }[];
}

export const OrderStatusBadge = ({
  actions,
  className,
  variant,
  ...props
}: OrderStatusBadgeProps): JSX.Element => {
  if (!variant) throw Error('OrderStatusBadge variant was not provided.');

  return (
    <div>
      <Badge
        className={cn(
          orderStatusBadgeVariants({ variant }),
          className,
          `flex flex-row items-center`,
        )}
        {...props}
      >
        {capitalize(variant.toLowerCase())}
        <OrderCardActions actions={actions} />
      </Badge>
    </div>
  );
};

function OrderCardActions({
  actions,
}: {
  actions?: { label: string; onClick: () => void }[];
}) {
  if (!actions || actions.length === 0) return <></>;

  return (
    <div className="ml-2.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-4 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="size-4 text-[#3F3F46]" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[30px]">
          {actions.map((action, idx) => (
            <DropdownMenuItem key={idx} onClick={() => action.onClick()}>
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
