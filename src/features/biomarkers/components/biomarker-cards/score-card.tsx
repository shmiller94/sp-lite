import { LockIcon } from '@/components/icons';
import { ArrowTopRight } from '@/components/icons/arrow-top-right-icon';
import NumberFlow from '@/components/shared/number-flow';
import { SuperpowerScoreLogo } from '@/components/shared/score-logo';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Body2, H1 } from '@/components/ui/typography';
import { useBiomarkers } from '@/features/biomarkers/api';
import { ScoreChart } from '@/features/biomarkers/components/charts/score-chart';
import { getHealthScoreDescription } from '@/features/biomarkers/utils/get-health-score-description';
import { mostRecent } from '@/features/biomarkers/utils/most-recent-biomarker';
import { cn } from '@/lib/utils';

export const ScoreCard = ({
  variant = 'home',
  onClick,
}: {
  variant?: 'home' | 'biomarkers';
  onClick?: () => void;
}) => {
  const getBiomarkersQuery = useBiomarkers();
  if (getBiomarkersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" />
      </div>
    );
  }

  if (!getBiomarkersQuery.data) {
    return null;
  }

  const latestScore = mostRecent(
    getBiomarkersQuery.data.biomarkers.find((b) => b.name == 'Health Score')
      ?.value ?? [],
  );

  if (variant === 'home') {
    return (
      <div
        className={cn(
          'group flex h-56 w-full flex-col transition-all duration-300 justify-between outline-transparent focus:outline-1 focus:outline-white/20 overflow-hidden rounded-2xl border border-white/10 bg-zinc-400/30 p-4 backdrop-blur-xl hover:border-white/20 hover:bg-zinc-400/40',
          latestScore ? 'cursor-pointer' : null,
          getBiomarkersQuery.isLoading ? 'opacity-50 animate-pulse' : null,
        )}
        onClick={latestScore ? onClick : undefined}
        role="presentation"
      >
        <div className="flex h-full flex-col justify-start transition-opacity duration-500">
          <div className="flex w-full flex-1 justify-between gap-4">
            <SuperpowerScoreLogo />
            {latestScore ? (
              <ArrowTopRight className="absolute right-5 top-5 text-white/50 transition-all duration-200 group-hover:right-4 group-hover:top-4 group-hover:text-white/75" />
            ) : (
              <LockIcon
                fill="currentColor"
                className="absolute right-5 top-5 w-5 text-white/50"
              />
            )}
          </div>
          <div className="flex w-full items-end justify-between gap-4">
            <div>
              {latestScore ? (
                <NumberFlow
                  value={Number(latestScore.quantity.value)}
                  className="text-6xl text-white"
                />
              ) : (
                <H1 className="text-white">--</H1>
              )}
              {latestScore ? (
                <Body2 className="text-white">Your health score</Body2>
              ) : (
                <Body2 className="text-white">Awaiting lab results</Body2>
              )}
            </div>
            {latestScore && (
              <div className="md:hidden">
                <Button
                  type="button"
                  variant="white"
                  size="medium"
                  onClick={() => onClick?.()}
                  className="border border-primary/10"
                >
                  More info
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between rounded-3xl bg-primary p-5 items-center h-[276px]',
      )}
      style={{
        backgroundImage: 'url("/cards/score.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SuperpowerScoreLogo />
      {latestScore?.quantity.value ? (
        <ScoreChart value={latestScore.quantity.value} />
      ) : (
        <H1 className="text-5xl text-white">--</H1>
      )}
      {latestScore?.quantity.value ? (
        <Body2 className="text-white">
          {getHealthScoreDescription(latestScore.quantity.value)}
        </Body2>
      ) : (
        <Body2 className="text-white">Awaiting lab results</Body2>
      )}
    </div>
  );
};
