import { m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { TextShimmer } from '@/components/ui/text-shimmer';
import { Body1, Body2 } from '@/components/ui/typography';
import { useUpdateActionAcceptance } from '@/features/protocol/api';
import { ProtocolBook } from '@/features/protocol/components/protocol-book';
import { useProtocolStepperContext } from '@/features/protocol/components/reveal/protocol-stepper-context';
import { getActionTypeImage } from '@/features/protocol/const/protocol-constants';
import { useRevealBuilderStore } from '@/features/protocol/stores/reveal-builder-store';

import { ProtocolStepLayout } from '../../../layouts/protocol-step-layout';

export const ProtocolProcessingStep = () => {
  const { next, protocol, goals } = useProtocolStepperContext();
  const { committedActions } = useRevealBuilderStore();
  const { mutateAsync: updateAcceptance } = useUpdateActionAcceptance();
  const [animationPhase, setAnimationPhase] = useState<
    'initial' | 'orbiting' | 'converging' | 'complete'
  >('initial');
  const [isBookOpen, setIsBookOpen] = useState(true);

  const selectedItems = Object.values(committedActions);
  const itemCount = selectedItems.length;

  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    let cancelled = false;
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (cancelled) return;
      setAnimationPhase('orbiting');

      // Fire acceptance calls in parallel with the animation (fire-and-forget)
      if (protocol) {
        const committedIds = new Set(selectedItems.map((item) => item.id));
        const allActions = goals.flatMap((goal) =>
          [goal.primaryAction, ...(goal.additionalActions ?? [])].filter(
            Boolean,
          ),
        );

        Promise.allSettled(
          allActions.map((action) =>
            updateAcceptance({
              protocolId: protocol.id,
              actionId: action.id,
              accepted: committedIds.has(action.id),
            }),
          ),
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (cancelled) return;
      setAnimationPhase('converging');

      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (cancelled) return;
      setAnimationPhase('complete');

      await new Promise((resolve) => setTimeout(resolve, 800));
      if (cancelled) return;
      setIsBookOpen(false);

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (cancelled) return;
      nextRef.current();
    };

    sequence();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTextStep = () => {
    switch (animationPhase) {
      case 'initial':
        return (
          <TextShimmer
            duration={1.2}
            className="truncate text-sm [--base-color:#9F9FA9] [--base-gradient-color:#FFF]"
          >
            Preparing your protocol...
          </TextShimmer>
        );
      case 'orbiting':
        return (
          <TextShimmer
            duration={1.2}
            className="truncate text-sm [--base-color:#9F9FA9] [--base-gradient-color:#FFF]"
          >
            Setting up your protocol...
          </TextShimmer>
        );
      case 'converging':
        return (
          <TextShimmer
            duration={1.2}
            className="truncate text-sm [--base-color:#9F9FA9] [--base-gradient-color:#FFF]"
          >
            Finalizing recommendations...
          </TextShimmer>
        );
      case 'complete':
        return (
          <TextShimmer
            duration={1.2}
            className="truncate text-sm [--base-color:#9F9FA9] [--base-gradient-color:#FFF]"
          >
            Completing protocol...
          </TextShimmer>
        );
      default:
        return '';
    }
  };

  const getItemPosition = (index: number, phase: string, time: number = 0) => {
    const baseAngle = itemCount === 1 ? 0 : (index / itemCount) * 360;
    const rotationSpeed = phase === 'orbiting' ? time * 30 : 0;
    const angle = baseAngle + rotationSpeed;

    let radius = 120;
    let centerX = 0;
    let centerY = 0;

    if (phase === 'initial') {
      radius = 160;
      centerX = 0;
      centerY = 0;
    } else if (phase === 'orbiting') {
      radius = 140;
      centerX = 0;
      centerY = 0;
    } else if (phase === 'converging') {
      radius = 80;
      centerX = 0;
      centerY = -10;
    } else if (phase === 'complete') {
      radius = 30;
      centerX = 0;
      centerY = -20;
    }

    const x = centerX + Math.cos((angle * Math.PI) / 180) * radius;
    const y = centerY + Math.sin((angle * Math.PI) / 180) * radius;

    return { x, y };
  };

  if (selectedItems.length === 0) {
    return (
      <ProtocolStepLayout className="relative overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Body1 className="text-secondary">
              No items selected for your protocol.
            </Body1>
          </div>
        </div>
      </ProtocolStepLayout>
    );
  }

  return (
    <ProtocolStepLayout fullWidth className="relative overflow-hidden">
      <div className="flex flex-1 items-center justify-center">
        <div className="relative flex size-[500px] items-center justify-center bg-[url('/protocol/circle-background.svg')] bg-contain bg-center bg-no-repeat">
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="z-10"
          >
            <ProtocolBook
              title="Protocol"
              coverImage="/protocol/protocol-book-cover.webp"
              className="pointer-events-none [&_p]:text-[10px]"
              isOpen={isBookOpen}
              showInnerContent={false}
            />

            <Body2 className="mt-4 text-center text-secondary">
              {renderTextStep()}
            </Body2>
          </m.div>

          {selectedItems.map((item, index) => {
            const initialPosition = getItemPosition(index, 'initial');

            return (
              <m.div
                key={item.id}
                className="absolute z-20"
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: initialPosition.x,
                  y: initialPosition.y,
                }}
                animate={
                  animationPhase === 'orbiting'
                    ? {
                        opacity: 1,
                        scale: 1,
                        x: Array.from(
                          { length: 13 },
                          (_, i) =>
                            getItemPosition(index, 'orbiting', i % 12).x,
                        ),
                        y: Array.from(
                          { length: 13 },
                          (_, i) =>
                            getItemPosition(index, 'orbiting', i % 12).y,
                        ),
                      }
                    : animationPhase === 'converging'
                      ? {
                          opacity: 1,
                          scale: 1,
                          x: getItemPosition(index, 'converging').x,
                          y: getItemPosition(index, 'converging').y,
                        }
                      : animationPhase === 'complete'
                        ? {
                            opacity: 0,
                            scale: 0.3,
                            x: getItemPosition(index, 'complete').x,
                            y: getItemPosition(index, 'complete').y,
                          }
                        : {
                            opacity: 1,
                            scale: 1,
                            x: initialPosition.x,
                            y: initialPosition.y,
                          }
                }
                transition={{
                  opacity:
                    animationPhase === 'complete'
                      ? { duration: 0.4, delay: index * 0.1, ease: 'easeOut' }
                      : { duration: 0.4, delay: index * 0.08 },
                  scale: {
                    duration:
                      animationPhase === 'initial'
                        ? 0.3
                        : animationPhase === 'complete'
                          ? 0.4
                          : 0.5,
                    delay:
                      animationPhase === 'initial'
                        ? index * 0.08
                        : animationPhase === 'complete'
                          ? index * 0.1
                          : 0,
                    ease: animationPhase === 'initial' ? 'backOut' : 'easeOut',
                  },
                  x:
                    animationPhase === 'orbiting'
                      ? {
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 0,
                        }
                      : {
                          duration:
                            animationPhase === 'converging'
                              ? 0.8
                              : animationPhase === 'complete'
                                ? 0.5
                                : 0.6,
                          ease: 'easeInOut',
                          delay:
                            animationPhase === 'complete' ? index * 0.05 : 0,
                        },
                  y:
                    animationPhase === 'orbiting'
                      ? {
                          duration: 8,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 0,
                        }
                      : {
                          duration:
                            animationPhase === 'converging'
                              ? 0.8
                              : animationPhase === 'complete'
                                ? 0.5
                                : 0.6,
                          ease: 'easeInOut',
                          delay:
                            animationPhase === 'complete' ? index * 0.05 : 0,
                        },
                }}
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
                }}
              >
                <div className="relative">
                  <div className="size-12 overflow-hidden rounded-full bg-white/50 p-px ring-2 ring-white/60 backdrop-blur-lg">
                    <img
                      src={getActionTypeImage(item.data.content)}
                      alt={item.data.title}
                      className="size-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </ProtocolStepLayout>
  );
};
