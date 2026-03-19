import { IconFileText } from '@central-icons-react/round-filled-radius-2-stroke-1.5/IconFileText';
import { m } from 'framer-motion';
import { ChevronRight, CircleCheck } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';

import { Link } from '@/components/ui/link';
import { FILE_CLASSIFICATION_LABELS } from '@/features/files/const/extraction-labels';

import type { FileIngestionDataPart } from '../../../utils/data-parts';

/** Base duration in ms for the fake progress to approach ~95%. */
const BASE_DURATION_MS = 1 * 60 * 1000;
/** Tick interval for updating the fake progress. */
const TICK_MS = 200;

/**
 * Attempt to exponentially decelerate toward 95%.
 * progress(t) = 95 * (1 - e^(-3t/T)) where T = BASE_DURATION_MS
 * This reaches ~50% at ~T/4 (~75s) and ~86% at ~T/2 (~150s), then crawls.
 */
function fakeProgress(elapsedMs: number): number {
  const k = 3 / BASE_DURATION_MS;
  return 95 * (1 - Math.exp(-k * elapsedMs));
}

export const FileIngestionBlock = memo(function FileIngestionBlock({
  part,
}: {
  part: FileIngestionDataPart;
}) {
  const { state, status, classification, filename, error } = part.data;

  const isFailed = state === 'complete' && status === 'failed';
  const isComplete = state === 'complete' && status === 'final';
  const isRegistered = status === 'registered';
  const isProcessing =
    isRegistered || (state === 'processing' && status === 'processing');

  const classificationLabel =
    typeof classification === 'string'
      ? (FILE_CLASSIFICATION_LABELS[classification] ?? classification)
      : null;
  const filenameLabel =
    typeof filename === 'string' && filename.length > 0 ? filename : 'Document';
  const errorMessage =
    typeof error === 'string' && error.length > 0 ? error : null;

  // Fake progress state
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isProcessing) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      setProgress(fakeProgress(elapsed));
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Snap to 100% when complete
  useEffect(() => {
    if (isComplete) {
      setProgress(100);
    }
  }, [isComplete]);

  const displayPercent = Math.round(isComplete ? 100 : progress);

  const statusLabel = isProcessing
    ? 'Processing documents...'
    : isComplete
      ? (classificationLabel ?? 'Document')
      : isFailed
        ? filenameLabel
        : filenameLabel;

  if (isComplete) {
    return (
      <Link
        to="/data"
        className="group my-1 flex items-center gap-3 rounded-full border border-zinc-100 bg-white px-4 py-3 pl-3 shadow shadow-black/[.03] transition-colors hover:bg-zinc-50"
      >
        <CircleCheck className="size-7 shrink-0 fill-vermillion-900 text-white" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
          View results summary
        </span>
        <ChevronRight className="size-5 shrink-0 text-zinc-300 transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:text-zinc-400" />
      </Link>
    );
  }

  return (
    <div className="my-1 flex items-center gap-1.5 rounded-full border border-zinc-100 bg-white px-4 py-2.5 pl-2">
      {/* Icon */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl text-zinc-400">
        <IconFileText />
      </div>

      {/* Right section: text row + progress bar */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Text row */}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-zinc-700">
            {statusLabel}
          </span>
          {isProcessing && (
            <span className="shrink-0 text-sm tabular-nums text-zinc-700">
              {displayPercent}%
            </span>
          )}
        </div>

        {isFailed && errorMessage !== null && (
          <span className="truncate text-xs text-red-500">{errorMessage}</span>
        )}

        {/* Progress bar */}
        {isProcessing && (
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-zinc-200">
            <m.div
              className="h-full rounded-full bg-vermillion-900"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>
    </div>
  );
});
