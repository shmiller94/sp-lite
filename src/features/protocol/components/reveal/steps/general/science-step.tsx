import { m } from 'framer-motion';
import { useCallback } from 'react';

import { ShimmerDune } from '@/components/shared/shimmer-dune';
import { Button } from '@/components/ui/button';
import { Body1, H2 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const MOCK_IMAGES = [
  '/protocol/science/scientist-1.webp',
  '/protocol/science/scientist-2.webp',
  '/protocol/science/scientist-3.webp',
  '/protocol/science/scientist-4.webp',
];

const MOCK_INSTITUTIONS = [
  '/protocol/science/harvard.webp',
  '/protocol/science/stanford.webp',
  '/protocol/science/ucla.webp',
];

export const ScienceStep = () => {
  const { next } = useProtocolStepperContext();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  return (
    <ProtocolStepLayout className="xs:overflow-visible">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-8">
        <ShimmerDune className="absolute left-1/2 top-1/2 -mt-16 -translate-x-1/2 -translate-y-1/2" />
        <div className="flex items-center justify-center gap-8">
          {MOCK_IMAGES.map((image, index) => (
            <m.img
              key={index}
              src={image}
              alt={`Scientist ${index + 1}`}
              style={{
                rotate: `${[-8, -4, -2, 4][index]}deg`,
              }}
              className="size-28 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-6">
          {MOCK_INSTITUTIONS.map((institution, index) => (
            <m.img
              key={index}
              src={institution}
              alt={`Institution ${index + 1}`}
              style={{
                width: `${[8, 5, 3][index]}rem`,
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <H2 className="mb-2 text-balance">
          Built on science,
          <br />
          together with experts
        </H2>
        <Body1 className="text-secondary">
          The Superpower protocol framework was designed together with leading
          medical researchers.
        </Body1>
      </div>

      <Button onClick={handleNext}>Next</Button>
    </ProtocolStepLayout>
  );
};
