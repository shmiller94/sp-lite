import { cn } from '@/lib/utils';

export const ProtocolStepLayout = ({
  children,
  className,
  fullWidth = false,
}: {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}) => {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-[calc(100vh-96px)] w-full flex-col gap-8 overflow-hidden py-8',
        // Push the last child (typically the button) to the bottom
        '[&>*:last-child]:mt-auto',
        // Calculate the max width as in md + the padding we add to each side
        !fullWidth && 'max-w-[calc(448px+16px*2)] px-4',
        className,
      )}
    >
      {children}
    </div>
  );
};
