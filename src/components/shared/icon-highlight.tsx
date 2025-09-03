import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export const IconHighlight = ({
  icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) => {
  const IconComponent = icon;

  return (
    <div
      className={cn(
        'rounded-full border-[3px] border-vermillion-900/20 p-2',
        className,
      )}
    >
      <IconComponent className="size-5 text-vermillion-900" />
    </div>
  );
};
