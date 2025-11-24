import { useEffect, useMemo, useRef, useState } from 'react';

import { Body1, H4 } from '@/components/ui/typography';
import { useBiologicalAge } from '@/features/data/hooks/use-biological-age';
import { VIDEOS } from '@/features/protocol/const/videos';
import { usePreloadVideo } from '@/features/protocol/hooks/use-preload-video';

import { ScoreCounter } from './score-counter';

const TITLE_DURATION_MS = 1500;
const NO_TITLE_START_MS = 350;
const NO_TITLE_END_MS = 200;

export const VideoSequence = ({ onComplete }: { onComplete: () => void }) => {
  const { biologicalAge } = useBiologicalAge();
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const item = useMemo(() => VIDEOS[index], [index]);
  const nextItem = useMemo(() => {
    const ni = index + 1;
    return ni < VIDEOS.length ? VIDEOS[ni] : undefined;
  }, [index]);

  usePreloadVideo(nextItem?.source);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 1;
  }, [item]);

  const noTitleIdxs = useMemo(
    () => VIDEOS.map((v, i) => (!v.title ? i : -1)).filter((i) => i >= 0),
    [],
  );

  const durations = useMemo(() => {
    const n = VIDEOS.length;
    const m = noTitleIdxs.length;
    const arr = Array.from({ length: n }, () => TITLE_DURATION_MS);
    if (m > 0) {
      if (m === 1) {
        arr[noTitleIdxs[0]] = NO_TITLE_END_MS;
      } else {
        const ratio = Math.pow(
          NO_TITLE_END_MS / NO_TITLE_START_MS,
          1 / (m - 1),
        );
        noTitleIdxs.forEach((idx, k) => {
          arr[idx] = Math.round(NO_TITLE_START_MS * Math.pow(ratio, k));
        });
      }
    }
    return arr;
  }, [noTitleIdxs]);

  useEffect(() => {
    if (finished) return;

    const total = Math.max(VIDEOS.length, 1);
    const ms = Math.max(0, durations[index] ?? TITLE_DURATION_MS);

    const id = window.setTimeout(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= total) {
          setFinished(true);
          return i;
        }
        return next;
      });
    }, ms);

    return () => window.clearTimeout(id);
  }, [index, finished, durations]);

  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  const stepsThroughIndex = useMemo(
    () => noTitleIdxs.filter((i) => i <= index).length,
    [noTitleIdxs, index],
  );
  const totalNoTitleSteps = noTitleIdxs.length;
  const currentStepCapped = useMemo(() => {
    const total = totalNoTitleSteps;
    if (total <= 0) return 0;
    return Math.min(stepsThroughIndex, Math.max(0, total - 1));
  }, [stepsThroughIndex, totalNoTitleSteps]);

  const remainingDuration = useMemo(() => {
    if (finished) return 0;
    return durations
      .slice(index + 1)
      .reduce((sum, duration) => sum + duration, 0);
  }, [index, finished, durations]);

  return (
    <div className="relative h-screen w-full bg-black">
      {!finished && (
        <video
          key={`${index}-${item.source}`}
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={item.source}
          autoPlay
          muted
          playsInline
          preload="auto"
        />
      )}
      {!finished && !item.title && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <ScoreCounter
            value={biologicalAge ?? 0}
            currentStep={currentStepCapped}
            totalSteps={totalNoTitleSteps}
            reserve={1}
            animationDuration={remainingDuration}
          >
            <div className="pointer-events-none opacity-0">
              <H4 className="text-center font-bold text-white">
                biological age
              </H4>
              <Body1 className="text-center text-white/80">Loading...</Body1>
            </div>
          </ScoreCounter>
        </div>
      )}
      {!finished && item.title && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
          <div
            key={index}
            className="mask-reveal-left max-w-3xl text-center text-white/95"
          >
            <p className="text-2xl font-semibold duration-500 animate-in fade-in md:text-3xl">
              {item.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
