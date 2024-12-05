import React, { Fragment } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { AffiliateInviteCard } from '@/features/affiliate/components/affiliate-invite-card';
import { useBiomarkers, useLatestHealthScore } from '@/features/biomarkers/api';
import {
  BiologicalAgeCard,
  ScoreCard,
} from '@/features/biomarkers/components/biomarker-cards';
import { useTimeline } from '@/features/home/api/get-timeline';
import { CompleteOnboardingCard } from '@/features/home/components/complete-onboarding-card';

export const LatestList = () => {
  const getLatestHealthScoreQuery = useLatestHealthScore();
  const biomarkersQuery = useBiomarkers();
  const timelineQuery = useTimeline();

  if (
    biomarkersQuery.isLoading ||
    getLatestHealthScoreQuery.isLoading ||
    timelineQuery.isLoading
  ) {
    return (
      <div className="space-y-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton className="h-[188px] w-full rounded-3xl" key={i} />
          ))}
      </div>
    );
  }

  const cards = [
    {
      content: <CompleteOnboardingCard />,
    },
    {
      content: <ScoreCard />,
    },
    {
      content: <BiologicalAgeCard />,
    },
    {
      content: <AffiliateInviteCard />,
    },
  ];

  return (
    <div className="space-y-3">
      {cards.map((c, index) => (
        <Fragment key={index}>{c.content}</Fragment>
      ))}
    </div>
  );
};
