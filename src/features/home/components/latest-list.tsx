import React, { Fragment } from 'react';

import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { AffiliateInviteCard } from '@/features/affiliate/components/affiliate-invite-card';
import { useBiomarkers, useLatestHealthScore } from '@/features/biomarkers/api';
import {
  BiologicalAgeCard,
  ScoreCard,
} from '@/features/biomarkers/components/biomarker-cards';
import { useTimeline } from '@/features/home/api/get-timeline';
import { CompleteOnboardingCard } from '@/features/home/components/complete-onboarding-card';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

const LATEST_CARDS = [
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

export const LatestList = () => {
  const getLatestHealthScoreQuery = useLatestHealthScore();
  const biomarkersQuery = useBiomarkers();
  const timelineQuery = useTimeline();
  const { width } = useWindowDimensions();

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

  if (width <= 1280) {
    return (
      <Carousel>
        <CarouselMainContainer>
          {LATEST_CARDS.map((card, index) => (
            <SliderMainItem key={index}>{card.content}</SliderMainItem>
          ))}
        </CarouselMainContainer>
        <CarouselThumbsContainer className="justify-center gap-x-1">
          {Array.from({ length: LATEST_CARDS.length }).map((_, index) => (
            <CarouselIndicator key={index} index={index} />
          ))}
        </CarouselThumbsContainer>
      </Carousel>
    );
  }

  return (
    <div className="space-y-3">
      {LATEST_CARDS.map((c, index) => (
        <Fragment key={index}>{c.content}</Fragment>
      ))}
    </div>
  );
};
