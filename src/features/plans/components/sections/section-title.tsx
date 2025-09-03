import { cn } from '@/lib/utils';

export const SectionTitle = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'space-y-2 bg-center bg-cover outline outline-white/25 outline-1 -outline-offset-1 overflow-hidden rounded-2xl text-white p-6',
        props.className,
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};
