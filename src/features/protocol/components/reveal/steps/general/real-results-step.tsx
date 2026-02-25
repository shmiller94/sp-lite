import { IconCircleQuestionmark } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconCircleQuestionmark';
import { IconDeepSearch } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconDeepSearch';
import { IconEmojiSmile } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconEmojiSmile';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Body1, Body2, H2, H3 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const TESTAMONIALS = [
  {
    image: '/protocol/reviews/cecilia.webp',
    name: 'Cecilia',
    age: 33,
    description: 'Proud Mother from San Francisco',
    quote:
      "Before Superpower, my health journey was lonely. I always trusted doctors. I'd go in and say, 'This stuff is happening to me,' and they'd say, 'It's just stress.' I'm like, I don't think it's stress.",
    highlights: [
      {
        icon: IconCircleQuestionmark,
        title:
          "Specialists couldn't find the source for her extreme fatigue & weakness",
      },
      {
        icon: IconDeepSearch,
        title: 'Superpower revealed low Vitamin D, Iron & elevated Toxins',
      },
      {
        icon: IconEmojiSmile,
        title:
          'Now feels great by taking the right supplements & removing toxins',
      },
    ],
  },
  {
    image: '/protocol/reviews/david.webp',
    name: 'David',
    age: 44,
    description: 'Engineering Leader from San Francisco',
    quote:
      "Within several weeks, I noticed an extremely huge difference in my energy. I felt more clear-headed. I don't need coffee in the afternoon anymore — I feel like a totally different person.",
    highlights: [
      {
        icon: IconCircleQuestionmark,
        title:
          'Felt healthy on paper but had inconsistent energy & something felt off',
      },
      {
        icon: IconDeepSearch,
        title:
          'Superpower revealed high CRP inflammation, elevated iron & triglycerides',
      },
      {
        icon: IconEmojiSmile,
        title:
          'Lost 15 pounds & no longer needs afternoon coffee — feels like a totally different person',
      },
    ],
  },
  {
    image: '/protocol/reviews/nitar.webp',
    name: 'Nitar',
    age: 36,
    description: 'Product Manager from Long Beach, CA',
    quote:
      "Superpower was like a mirror shown to my face — you're not as healthy as you thought. You can't bank on being young anymore. You have to course correct.",
    highlights: [
      {
        icon: IconCircleQuestionmark,
        title:
          'Experiencing fatigue, weight gain & low motivation despite working out 5x a week',
      },
      {
        icon: IconDeepSearch,
        title:
          'Superpower revealed biological age of 42, elevated thyroid antibodies & insulin spikes',
      },
      {
        icon: IconEmojiSmile,
        title:
          'Now taking targeted supplements & walks after meals — energy and motivation restored',
      },
    ],
  },
  {
    image: '/protocol/reviews/raquel.webp',
    name: 'Raquel',
    age: 33,
    description: 'Mom of Two from Austin, TX',
    quote:
      "Since getting my energy back, it's really improved my time with my son because I'm actually enjoying it. A three o'clock crash is not ideal when your day is just getting started.",
    highlights: [
      {
        icon: IconCircleQuestionmark,
        title:
          'Extreme postpartum fatigue & hair loss that persisted years after pregnancy',
      },
      {
        icon: IconDeepSearch,
        title:
          'Superpower revealed critically low ferritin at 30 ng/mL, plus low Vitamin D & elevated cholesterol',
      },
      {
        icon: IconEmojiSmile,
        title:
          'Hair growing back & no more 3pm crash — finally has energy to enjoy time with her kids',
      },
    ],
  },
  {
    image: '/protocol/reviews/john.webp',
    name: 'John',
    age: 57,
    description: 'Military Veteran & Retired IT Leader from Colorado',
    quote:
      "Superpower gave me a game plan on how to improve. I felt better last month than I've felt in probably five years.",
    highlights: [
      {
        icon: IconCircleQuestionmark,
        title:
          'Previous doctor missed low testosterone — felt tired and blamed it on aging',
      },
      {
        icon: IconDeepSearch,
        title:
          'Superpower caught testosterone at 300 ng/dL (optimal 500–700 ng/dL) & provided a full game plan',
      },
      {
        icon: IconEmojiSmile,
        title:
          'Feels better than he has in 5 years — staying active for his grandkids',
      },
    ],
  },
];

export const RealResultsStep = () => {
  const { next } = useProtocolStepperContext();
  const { track } = useAnalytics();
  const isManualNavRef = useRef(false);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 3000 })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        isManualNavRef.current = true;
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(newIndex);
      track('protocol_reveal_testimonial_slide_changed', {
        slide_index: newIndex,
        testimonial_name: TESTAMONIALS[newIndex]?.name,
        interaction_type: isManualNavRef.current ? 'manual' : 'autoplay',
      });
      isManualNavRef.current = false;
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, track]);

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  return (
    <ProtocolStepLayout className="px-0">
      <div className="px-4 text-center">
        <H2 className="mb-2 text-center">Real people, real results.</H2>
        <Body1 className="text-secondary">
          See what members discovered — and what they did next.
        </Body1>
      </div>
      <div
        className="flex w-full flex-1 flex-col items-start space-y-4"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div className="embla w-full overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {TESTAMONIALS.map((testimonial, testimonialIndex) => (
              <div
                key={testimonialIndex}
                className="embla__slide w-[90%] shrink-0 cursor-grab select-none px-4 active:cursor-grabbing xs:w-full"
              >
                <div className="w-full space-y-4 rounded-2xl border border-zinc-200 bg-white p-4">
                  <img
                    src={testimonial.image}
                    alt="Testimonial"
                    className="media-organic-reveal h-64 w-full rounded-lg object-cover"
                  />
                  <div>
                    <H3>
                      {testimonial.name}, {testimonial.age}
                    </H3>
                    <Body2 className="text-secondary">
                      {testimonial.description}
                    </Body2>
                  </div>
                  {testimonial.quote && (
                    <Body2 className="italic text-secondary">
                      &ldquo;{testimonial.quote}&rdquo;
                    </Body2>
                  )}
                  <div className="space-y-2">
                    {testimonial.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-1">
                        <div className="mr-2 flex size-6 shrink-0 items-center justify-center rounded-full bg-vermillion-900/20">
                          {
                            <highlight.icon className="size-3.5 text-vermillion-900" />
                          }
                        </div>
                        <Body2>{highlight.title}</Body2>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {TESTAMONIALS.length > 1 && (
          <div className="flex w-full justify-center">
            <div className="flex space-x-2">
              {TESTAMONIALS.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'size-1 rounded-full bg-zinc-400 transition-all',
                    index === selectedIndex && 'w-4 bg-black',
                  )}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4">
        <Button className="w-full" onClick={handleNext}>
          Next
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
