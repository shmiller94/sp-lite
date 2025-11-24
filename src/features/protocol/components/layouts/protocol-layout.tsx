import { cn } from '@/lib/utils';

export const ProtocolLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('mx-auto w-full max-w-[1600px] lg:px-16', className)}>
      <div className="flex items-start">{children}</div>
    </div>
  );
};
