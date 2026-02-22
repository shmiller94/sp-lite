import { Skeleton } from '@/components/ui/skeleton';

const GRID_SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

export const MarketplaceSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 *:h-[40px] *:rounded-[10px]">
        <Skeleton className="w-44 md:w-64" />
        <Skeleton className="w-56 md:w-80" />
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4">
        {GRID_SKELETON_KEYS.map((key) => (
          <Skeleton
            className="aspect-square w-full rounded-[20px] md:h-full"
            key={key}
          />
        ))}
      </div>
    </div>
  );
};
