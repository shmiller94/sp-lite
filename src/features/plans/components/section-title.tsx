import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

export const SectionTitle = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { isInView, ref } = useInView<HTMLDivElement>({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'space-y-2 bg-center bg-cover outline outline-white/25 outline-1 -outline-offset-1 overflow-hidden rounded-2xl text-white p-6',
        props.className,
      )}
      {...props}
    >
      <div
        className={cn(
          'overflow-hidden transition-all duration-1000 ease-out',
          '[mask-image:linear-gradient(to_left,transparent_50%,black_80%,black_100%)]',
          '[mask-size:200%_100%]',
          isInView ? '[mask-position:0%_0%]' : '[mask-position:150%_0%]',
        )}
      >
        {props.children}
      </div>
    </div>
  );
};
