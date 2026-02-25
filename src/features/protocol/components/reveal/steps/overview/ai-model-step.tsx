import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Body2, H2 } from '@/components/ui/typography';
import { AnimatedIcon } from '@/features/messages/components/ai/animated-icon';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

export const AiModelStep = () => {
  const { next } = useProtocolStepperContext();

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  return (
    <ProtocolStepLayout fullWidth>
      <H2 className="mb-1 px-4 text-center md:text-3xl">
        Powered by our Proprietary AI Model
      </H2>
      <div className="relative mx-auto w-full max-w-2xl flex-1 duration-500 animate-in fade-in rounded-mask">
        <div className="media-organic-reveal absolute left-1/2 h-full w-screen max-w-2xl -translate-x-1/2 bg-[url('/protocol/ai-model/ai-model-background.webp')] bg-cover bg-top bg-no-repeat">
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-xl border border-zinc-100 bg-white">
              <AnimatedIcon size={40} state="idle" />
            </div>

            <m.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative max-w-md rounded-xl bg-white p-4"
            >
              <svg
                width="15"
                height="8"
                viewBox="0 0 15 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -top-1.5 left-1/2 -translate-x-1/2"
              >
                <path
                  d="M1.00217 7.24268C0.111268 7.24268 -0.3349 6.16554 0.295064 5.53558L4.95191 0.878713C6.12348 -0.292863 8.02297 -0.292865 9.19455 0.878708L13.8514 5.53556C14.4814 6.16553 14.0352 7.24267 13.1443 7.24267L1.00217 7.24268Z"
                  fill="white"
                />
              </svg>
              <Body2 className="text-center">
                At any point during this experience, you can tap on this icon to
                ask your AI any questions.
              </Body2>
            </m.div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center px-4">
        <Button className="mx-auto w-full max-w-md" onClick={handleNext}>
          Continue
        </Button>
      </div>
    </ProtocolStepLayout>
  );
};
