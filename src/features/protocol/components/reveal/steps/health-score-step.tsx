type HealthScoreStepProps = {
  next: () => void;
  previous: () => void;
};
import { useMemo } from 'react';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { SuperpowerScoreLogo } from '@/components/shared/score-logo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, H2 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/data/api';
import { MESSAGES } from '@/features/data/const/messages';
import { mostRecent } from '@/features/data/utils/most-recent-biomarker';
import { useUser } from '@/lib/auth';

import { ScoreCounter } from '../score-counter';

export function HealthScoreStep({ next }: HealthScoreStepProps) {
  const { data: biomarkersData, isLoading: isBiomarkersLoading } =
    useBiomarkers();
  const { data: userData, isLoading: isUserLoading } = useUser();

  const isLoading = isBiomarkersLoading || isUserLoading;

  const value = useMemo(() => {
    const healthScore = biomarkersData?.biomarkers.find(
      (b) => b.name === 'Health Score',
    );
    return mostRecent(healthScore?.value ?? [])?.quantity.value ?? 0;
  }, [biomarkersData]);

  const overviewCopy = MESSAGES.find(
    (m) => m.scoreRange[0] <= value! && m.scoreRange[1] >= value!,
  );

  return (
    <div className="h-screen w-full bg-black">
      <div className="relative size-full bg-[url(/action-plan/intro/mouth-wash.webp)] bg-cover bg-center duration-1000 animate-in fade-in">
        <SuperpowerLogo
          className="absolute left-1/2 top-8 z-10 -translate-x-1/2 lg:hidden"
          fill="white"
        />
        <div className="absolute inset-0 z-10 p-6 text-white">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="mx-auto size-80 rounded-full bg-white/10 lg:size-[512px]" />
            ) : (
              <ScoreCounter
                value={value}
                animate
                progressMax={100}
                animationDuration={1000}
                easing="cubic-bezier(0.16, 1, 0.3, 1)"
              >
                <div className="flex flex-col justify-center">
                  <SuperpowerScoreLogo />
                  <Body1 className="text-center text-white/80">
                    out of 100
                  </Body1>
                </div>
              </ScoreCounter>
            )}
          </div>
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex w-full flex-col items-center bg-gradient-to-b from-transparent via-black/80 to-black/90 px-6 py-24 lg:pb-[5vw] lg:pt-[10vw]">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="mx-auto h-12 w-64 rounded-xl bg-white/10" />
                <Skeleton className="mx-auto h-12 w-40 rounded-xl bg-white/10" />
                <Skeleton className="mx-auto h-16 w-72 rounded-full bg-white/10" />
              </div>
            ) : (
              <>
                <H2 className="mb-2 text-center text-white animate-in fade-in">
                  Your Superpower Score is {value}
                </H2>
                <Body1 className="mb-8 max-w-lg text-center text-white/80 delay-100 animate-in fade-in">
                  {userData?.firstName}, {overviewCopy?.message}
                </Body1>
                <Button
                  variant="glass-outline"
                  className="w-full max-w-sm rounded-full"
                  onClick={next}
                >
                  Continue
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  );
}
