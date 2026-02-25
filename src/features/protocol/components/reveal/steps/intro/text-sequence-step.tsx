'use client';

import type { Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

import { TextEffect } from '@/components/ui/text-effect';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

const TEXT_SEQUENCE = [
  "We've analyzed all your data",
  'Identified core insights',
  'And created a personal protocol',
  "It's time to meet your inner clock",
];

export const TextSequenceStep = () => {
  const { next } = useProtocolStepperContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trigger, setTrigger] = useState(true);

  const blurSlideVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03 },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    } satisfies Variants,
    item: {
      hidden: {
        opacity: 0,
        filter: 'blur(4px) brightness(60%)',
        y: 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px) brightness(100%)',
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    } satisfies Variants,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= TEXT_SEQUENCE.length) {
            next();
            return prevIndex;
          }
          return nextIndex;
        });
        setTrigger(true);
      }, 600);
    }, 3000);

    return () => clearInterval(interval);
  }, [next]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <TextEffect
        as="h4"
        className="text-center text-2xl text-secondary"
        per="char"
        variants={{
          container: blurSlideVariants.container,
          item: blurSlideVariants.item,
        }}
        trigger={trigger}
      >
        {TEXT_SEQUENCE[currentIndex]}
      </TextEffect>
    </div>
  );
};
