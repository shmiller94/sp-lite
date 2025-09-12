import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const TimelineSkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn('w-full overflow-hidden', className)}>
      <Skeleton className="flex h-[86px] w-full items-center justify-between rounded-3xl bg-zinc-200 p-5">
        <div className="flex min-w-0 items-center gap-4">
          {/* Image */}
          <Skeleton className="size-12 shrink-0 rounded-xl bg-white/50" />
          {/* Title + description */}
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-[100px] bg-white/50" />
            <Skeleton className="h-4 w-[130px] bg-white/50 md:w-[250px]" />
          </div>
        </div>
        {/* Right button */}
        <div className="ml-4 shrink-0">
          <Skeleton className="h-11 w-[90px] rounded-xl bg-white/50 md:w-[95px]" />
        </div>
      </Skeleton>
    </div>
  );
};

export const TimelineListSkeleton = () => {
  return (
    <div className="mt-10 w-full md:mt-auto">
      {/* Onboarding items skeleton  */}
      <div className="space-y-1 md:space-y-3">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="w-full">
              <div className="flex items-center gap-3">
                {/* Timeline dot */}
                <div className="hidden h-full md:block">
                  <Skeleton className="size-5 animate-spin rounded-full border border-dashed border-zinc-300 bg-transparent ease-in-out" />
                </div>
                <TimelineSkeletonCard />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
