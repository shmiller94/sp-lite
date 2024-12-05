import * as React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { useBiomarkers, useLatestHealthScore } from '@/features/biomarkers/api';

import {
  BiologicalAgeCard,
  BiomarkersSummaryCard,
  ScoreCard,
} from './biomarker-cards';

export const DataCards = () => {
  const getLatestHealthScoreQuery = useLatestHealthScore();
  const biomarkersQuery = useBiomarkers();

  if (biomarkersQuery.isLoading || getLatestHealthScoreQuery.isLoading) {
    return (
      <section
        id="summary"
        className="flex flex-col gap-5 pt-6 xl:flex-row xl:pb-16"
      >
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton className="h-[276px] w-full rounded-3xl" key={i} />
          ))}
      </section>
    );
  }

  return (
    <section
      id="summary"
      className="flex flex-col gap-5 pt-6 xl:flex-row xl:pb-16"
    >
      <ScoreCard variant="biomarkers" />
      <BiologicalAgeCard variant="biomarkers" />
      <BiomarkersSummaryCard variant="biomarkers" />
    </section>
  );
};
