import * as React from 'react';
import { Fragment } from 'react';

import {
  Carousel,
  CarouselMainContainer,
  SliderMainItem,
  CarouselThumbsContainer,
  CarouselIndicator,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useBiomarkers } from '@/features/biomarkers/api';
import {
  BiologicalAgeCard,
  ScoreCard,
} from '@/features/biomarkers/components/biomarker-cards';
import { SharablesTabType } from '@/features/home/components/shareable';
import { usePlans } from '@/features/plans/api/get-plans';
import { ProtocolCard } from '@/features/plans/components/plan-cards';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';

export const HomeCards = ({
  onClick,
}: {
  onClick?: (tab: SharablesTabType) => void;
}) => {
  const DATA_CARDS = [
    {
      content: (
        <ScoreCard
          variant="home"
          onClick={() => onClick && onClick('superpower-score')}
        />
      ),
    },
    {
      content: (
        <BiologicalAgeCard
          variant="home"
          onClick={() => onClick && onClick('biological-age')}
        />
      ),
    },
    {
      content: <ProtocolCard />,
    },
  ];

  const biomarkersQuery = useBiomarkers();
  const actionPlansQuery = usePlans();
  const { width } = useWindowDimensions();

  if (biomarkersQuery.isLoading || actionPlansQuery.isLoading) {
    return (
      <section id="summary" className="grid gap-2 lg:grid-cols-3">
        {width <= 1024 ? (
          <SkeletonCard />
        ) : (
          DATA_CARDS.map((_, i) => <SkeletonCard key={i} />)
        )}
      </section>
    );
  }

  if (width <= 1024) {
    return (
      <Carousel>
        <CarouselMainContainer>
          {DATA_CARDS.map((card, index) => (
            <SliderMainItem key={index} className="px-6">
              {card.content}
            </SliderMainItem>
          ))}
        </CarouselMainContainer>
        <CarouselThumbsContainer className="justify-center gap-x-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselIndicator
              key={index}
              index={index}
              className="size-1.5 data-[active='false']:bg-white/30 data-[active='true']:bg-white hover:bg-white/50"
            />
          ))}
        </CarouselThumbsContainer>
      </Carousel>
    );
  }

  return (
    <section id="summary" className="grid grid-cols-3 gap-2">
      {DATA_CARDS.map((card, index) => (
        <Fragment key={index}>{card.content}</Fragment>
      ))}
    </section>
  );
};

function SkeletonCard() {
  return (
    <div className="group flex h-56 w-full animate-pulse flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-400/30 p-4 opacity-50 outline-transparent backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-zinc-400/40 focus:outline-1 focus:outline-white/20">
      <div className="flex h-full flex-col justify-start transition-opacity duration-500">
        <div className="flex h-full flex-col justify-between opacity-20">
          <div className="flex w-full items-center justify-between gap-4">
            <Skeleton className="h-8 w-full max-w-32 rounded-lg" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-full max-w-32 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-16 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
