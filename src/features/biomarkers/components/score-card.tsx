import { SuperpowerScoreLogo } from '@/components/shared/score-logo';
import { Spinner } from '@/components/ui/spinner';
import { Body2 } from '@/components/ui/typography';
import { useLatestHealthScore } from '@/features/biomarkers/api/get-latest-healthscore';
import { ScoreChart } from '@/features/biomarkers/components/charts/score-chart';

export const ScoreCard = () => {
  const getLatestHealthScoreQuery = useLatestHealthScore();

  if (getLatestHealthScoreQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner variant="primary" />
      </div>
    );
  }

  if (!getLatestHealthScoreQuery.data) {
    return null;
  }

  const latestScore = getLatestHealthScoreQuery.data.healthScoreResult;

  if (!latestScore) {
    return null;
  }

  return (
    <div
      className="flex h-[276px] w-full flex-col items-center justify-between rounded-3xl p-6"
      style={{
        backgroundImage: 'url("/cards/score.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SuperpowerScoreLogo />
      <ScoreChart value={latestScore.finalScore} />

      <Body2 className="text-white">{latestScore.finalScoreStatus}</Body2>
    </div>
  );
};
