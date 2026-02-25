import { useNavigate, useRouterState } from '@tanstack/react-router';
import { m } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';

import { H2 } from '@/components/ui/typography';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { setRevealExitTarget } from '@/features/protocol/components/reveal/reveal-exit';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

const JOURNEY_OPTIONS = [
  {
    id: 'data',
    text: 'Go through the rest of my data',
    image: '/protocol/final/wavy-chart.webp',
    href: '/data',
  },
  {
    id: 'next-steps',
    text: 'Review my next steps',
    image: '/protocol/final/protocol-book.webp',
    href: '/protocol',
  },
  {
    id: 'ai-questions',
    text: 'Ask Superpower AI with questions',
    image: '/protocol/final/superpower-ai-icon.webp',
    href: '/concierge',
  },
];

export const HealthJourneyStep = () => {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { completeReveal } = useProtocolStepperContext();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleOptionSelect = useCallback(
    async (optionId: string) => {
      if (isCompleting) return;

      setIsCompleting(true);
      const target =
        JOURNEY_OPTIONS.find((option) => option.id === optionId)?.href ??
        '/protocol';
      setRevealExitTarget(target);
      try {
        await completeReveal();
      } catch (error) {
        console.error('Failed to complete reveal:', error);
        setIsCompleting(false);
        return;
      }

      if (pathname !== target) {
        navigate({ to: target, replace: true });
      }
    },
    [navigate, completeReveal, isCompleting, pathname],
  );

  return (
    <ProtocolStepLayout fullWidth>
      <div className="mx-auto w-full max-w-xl md:rounded-mask">
        <img
          src="/protocol/final/friends-hugging.webp"
          alt="Friends hugging"
          className="media-organic-reveal max-h-96 w-full object-cover object-top"
        />
      </div>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 flex-col justify-center px-4 py-12"
      >
        <div className="mb-4 text-center">
          <H2>What&apos;s next in your</H2>
          <H2>health journey?</H2>
        </div>

        <div className="mx-auto w-full max-w-md space-y-4">
          {JOURNEY_OPTIONS.map((option, index) => (
            <m.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
              onClick={() => {
                handleOptionSelect(option.id);
              }}
              className="group flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow shadow-black/[.03] transition-all hover:bg-zinc-50"
            >
              <img src={option.image} alt={option.text} className="size-16" />
              <div className="flex flex-1 items-center justify-between gap-4 p-4 pl-0">
                <span className="flex-1 text-left text-lg font-medium text-zinc-900">
                  {option.text}
                </span>
                <ChevronRight className="size-4 text-zinc-400 transition-all duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-zinc-500" />
              </div>
            </m.button>
          ))}
        </div>
      </m.div>
    </ProtocolStepLayout>
  );
};
