import { LockKeyholeIcon } from 'lucide-react';
import { Suspense, lazy } from 'react';

import { useLatestCompletedPlan } from '@/features/protocol/hooks/use-latest-completed-plan';

const LazyDigitalTwin = lazy(() =>
  import('@/features/digital-twin/components/digital-twin').then((mod) => ({
    default: mod.DigitalTwin,
  })),
);

export const DigitalTwinPreviewMobile = () => {
  const { hasCompletedPlan, isLoading } = useLatestCompletedPlan();

  return (
    <div className="relative h-56 w-full overflow-hidden lg:hidden">
      <div className="pointer-events-none">
        {!isLoading && hasCompletedPlan ? (
          <Suspense fallback={<div className="h-56 w-full" />}>
            <LazyDigitalTwin />
          </Suspense>
        ) : (
          <div className="h-56 w-full" />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-zinc-50" />
      {!isLoading && !hasCompletedPlan && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center">
          <div
            className="pointer-events-auto flex flex-row items-center gap-3 rounded-[8px] bg-white/10 px-6 py-4"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <LockKeyholeIcon
              className="size-6 shrink-0 text-zinc-500"
              strokeWidth={1.5}
            />
            <h3 className="text-lg font-medium leading-6 text-zinc-500">
              Unlock after your baseline test
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
