import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

import { DataCard } from './data-card';

interface MobileCarouselProps {
  cards: ReadonlyArray<{
    type: 'superpower-score' | 'biological-age' | 'protocol';
    onClick?: () => void;
  }>;
  dataState: 'loading' | 'loaded' | 'error';
  healthScoreData?: any;
  biologicalAge?: number | null;
  ageDifference?: number | null;
}

export const MobileCarousel = ({
  cards,
  dataState,
  healthScoreData,
  biologicalAge,
  ageDifference,
}: MobileCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {cards.map((card, index) => (
            <div key={card.type} className="min-w-0 flex-[0_0_100%] px-4">
              <div className="m-0 w-full border-0 bg-transparent p-0 text-left">
                <DataCard
                  dataState={dataState}
                  healthScoreData={healthScoreData}
                  biologicalAge={biologicalAge}
                  ageDifference={ageDifference}
                  cardType={card.type}
                  onClick={card.onClick}
                  animationDelay={index * 0.25}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-200',
              selectedIndex === index
                ? 'bg-white'
                : 'bg-white/30 hover:bg-white/50',
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
