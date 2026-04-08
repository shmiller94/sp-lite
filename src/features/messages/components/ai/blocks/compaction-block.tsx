import { IconLayersThree } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconLayersThree';
import { IconLayersTwo } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconLayersTwo';
import { m, useMotionValue, useTransform, animate } from 'framer-motion';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { TextShimmer } from '@/components/ui/text-shimmer';

import type { CompactionDataPart } from '../../../utils/data-parts';

const COMPLETE_DISPLAY_MS = 5000;

export const CompactionBlock = memo(function CompactionBlock({
  parts,
}: {
  parts: CompactionDataPart[];
}) {
  // Use the latest part (last one has the most recent state)
  const latest = parts.length > 0 ? parts[parts.length - 1] : undefined;

  const data = latest?.data;
  const isProcessing = data?.state === 'in-progress';
  const isComplete = data?.state === 'complete';

  const hasSeenProcessingRef = useRef(isProcessing);
  const dismissedRef = useRef(false);
  const completionDismissTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [, setDismissedVersion] = useState(0);

  // Animated progress value (0–100)
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, (v) => `${v}%`);
  const displayPercent = useTransform(progress, (v) => Math.round(v));
  const [percentText, setPercentText] = useState('0');
  const progressAnimRef = useRef<ReturnType<typeof animate> | null>(null);

  // Sync displayPercent to text for rendering
  useEffect(() => {
    const unsubscribe = displayPercent.on('change', (v) => {
      setPercentText(String(v));
    });
    return unsubscribe;
  }, [displayPercent]);

  // Animate progress based on state
  useEffect(() => {
    if (isProcessing) {
      // Decelerate toward 90% over 20s — gets slower and slower
      progressAnimRef.current = animate(progress, 90, {
        duration: 20,
        ease: [0.1, 0.5, 0.1, 1], // fast start, very slow end
      });
    } else if (isComplete) {
      // Stop current animation and snap to 100%
      if (progressAnimRef.current) {
        progressAnimRef.current.stop();
        progressAnimRef.current = null;
      }
      progressAnimRef.current = animate(progress, 100, {
        duration: 0.4,
        ease: 'easeOut',
      });
    }

    return () => {
      if (progressAnimRef.current) {
        progressAnimRef.current.stop();
        progressAnimRef.current = null;
      }
    };
  }, [isProcessing, isComplete, progress]);

  if (isProcessing) hasSeenProcessingRef.current = true;

  const showCompletion =
    isComplete && hasSeenProcessingRef.current && !dismissedRef.current;

  let showState: 'processing' | 'complete' | 'hidden' = 'hidden';
  if (isProcessing) showState = 'processing';
  else if (showCompletion) showState = 'complete';

  const setCompleteBlockRef = useCallback((node: HTMLDivElement | null) => {
    if (node === null) {
      if (completionDismissTimeoutRef.current !== null) {
        clearTimeout(completionDismissTimeoutRef.current);
        completionDismissTimeoutRef.current = null;
      }
      return;
    }
    if (dismissedRef.current) return;

    if (completionDismissTimeoutRef.current !== null) {
      clearTimeout(completionDismissTimeoutRef.current);
    }
    completionDismissTimeoutRef.current = setTimeout(() => {
      dismissedRef.current = true;
      setDismissedVersion((curr) => curr + 1);
      completionDismissTimeoutRef.current = null;
    }, COMPLETE_DISPLAY_MS);
  }, []);

  const handleCompleteAnimationEnd = useCallback(() => {
    if (dismissedRef.current) return;
    if (completionDismissTimeoutRef.current !== null) {
      clearTimeout(completionDismissTimeoutRef.current);
      completionDismissTimeoutRef.current = null;
    }
    dismissedRef.current = true;
    setDismissedVersion((curr) => curr + 1);
  }, []);

  if (showState === 'hidden') return null;

  const label = isComplete
    ? 'Conversation condensed'
    : 'Condensing conversation...';

  return (
    <m.div
      ref={isComplete ? setCompleteBlockRef : undefined}
      className="my-1 flex items-center gap-1.5 rounded-full border border-zinc-100 bg-white px-4 py-2.5 pl-2"
      initial={isComplete ? { opacity: 1 } : undefined}
      animate={isComplete ? { opacity: [1, 1, 0] } : undefined}
      transition={
        isComplete
          ? {
              duration: 0.35,
              ease: 'easeOut',
              delay: (COMPLETE_DISPLAY_MS - 350) / 1000,
            }
          : undefined
      }
      onAnimationComplete={isComplete ? handleCompleteAnimationEnd : undefined}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl text-zinc-400">
        {isComplete ? <IconLayersTwo /> : <IconLayersThree />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          {isProcessing ? (
            <TextShimmer className="truncate text-sm font-medium">
              {label}
            </TextShimmer>
          ) : (
            <span className="truncate text-sm font-medium text-zinc-700">
              {label}
            </span>
          )}
          <span className="shrink-0 text-sm tabular-nums text-zinc-700">
            {percentText}%
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-zinc-200">
          <m.div
            className="h-full rounded-full bg-vermillion-900"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </m.div>
  );
});
