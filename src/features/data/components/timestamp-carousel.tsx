import { ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselMainContainer,
  SliderMainItem,
  useCarousel,
} from '@/components/ui/carousel';
import { Body1 } from '@/components/ui/typography';

interface TimestampCarouselProps {
  timestamps: string[];
  onTimestampChange: (index: number) => void;
}

const CarouselContent = ({
  timestamps,
  onTimestampChange,
  formatTimestamp,
}: TimestampCarouselProps & {
  formatTimestamp: (timestamp: string) => string;
}) => {
  const { scrollNext, scrollPrev, emblaMainApi } = useCarousel();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return;
    const selected = emblaMainApi.selectedScrollSnap();
    onTimestampChange(timestamps.length - 1 - selected);

    setCanScrollPrev(emblaMainApi.canScrollPrev());
    setCanScrollNext(emblaMainApi.canScrollNext());
  }, [emblaMainApi, onTimestampChange, timestamps.length]);

  useEffect(() => {
    if (!emblaMainApi) return;

    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);

    emblaMainApi.scrollTo(timestamps.length - 1);

    return () => {
      emblaMainApi.off('select', onSelect);
      emblaMainApi.off('reInit', onSelect);
    };
  }, [emblaMainApi, onSelect, timestamps.length]);

  return (
    <div className="relative px-8">
      <Button
        variant="ghost"
        size="small"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 z-10 aspect-square w-8 -translate-y-1/2 bg-zinc-100 p-2 text-zinc-900 hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <CarouselMainContainer
        className="cursor-grab select-none active:cursor-grabbing"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 10%, black 90%, transparent 100%)',
        }}
      >
        {timestamps.toReversed().map((timestamp, index) => (
          <SliderMainItem key={index} className="basis-1/3">
            <Body1
              className={'text-center text-sm text-zinc-500 transition-colors'}
            >
              {formatTimestamp(timestamp)}
            </Body1>
          </SliderMainItem>
        ))}
      </CarouselMainContainer>
      <Button
        variant="ghost"
        size="small"
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 z-10 aspect-square w-8 -translate-y-1/2 bg-zinc-100 p-2 text-zinc-900 hover:bg-zinc-200 disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export const TimestampCarousel = ({
  timestamps,
  onTimestampChange,
}: TimestampCarouselProps) => {
  const formatTimestamp = (timestamp: string) => {
    return moment(timestamp).format('MMM D, YYYY');
  };

  return (
    <Carousel
      carouselOptions={{
        align: 'center',
        containScroll: false,
        dragFree: false,
        loop: false,
        slidesToScroll: 1,
      }}
    >
      <CarouselContent
        timestamps={timestamps}
        onTimestampChange={onTimestampChange}
        formatTimestamp={formatTimestamp}
      />
    </Carousel>
  );
};
