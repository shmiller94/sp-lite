import { memo } from 'react';

import { Badge } from '@/components/ui/badge';
import { TextShimmer } from '@/components/ui/text-shimmer';
import {
  FILE_CLASSIFICATION_LABELS,
  FILE_EXTRACTION_PHASE_LABELS,
} from '@/features/files/const/extraction-labels';

import type { FileIngestionDataPart } from '../../../utils/data-parts';

export const FileIngestionBlock = memo(function FileIngestionBlock({
  part,
}: {
  part: FileIngestionDataPart;
}) {
  const {
    state,
    status,
    phase,
    classification,
    writtenCount,
    filename,
    message,
    error,
  } = part.data;

  const isFailed = state === 'complete' && status === 'failed';
  const isComplete = state === 'complete' && status === 'final';
  const isRegistered = status === 'registered';
  const isProcessing = state === 'processing' && status === 'processing';

  const phaseLabel =
    typeof phase === 'string'
      ? (FILE_EXTRACTION_PHASE_LABELS[phase] ?? phase)
      : null;
  const classificationLabel =
    typeof classification === 'string'
      ? (FILE_CLASSIFICATION_LABELS[classification] ?? classification)
      : null;
  const hasWrittenCount = typeof writtenCount === 'number';
  const hasSavedResults = hasWrittenCount && writtenCount > 0;
  const filenameLabel =
    typeof filename === 'string' && filename.length > 0
      ? filename
      : 'File Processing';
  const finalMessage =
    typeof message === 'string' && message.length > 0 ? message : null;
  const errorMessage =
    typeof error === 'string' && error.length > 0 ? error : null;

  return (
    <div className="my-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-zinc-700">
          {filenameLabel}
        </span>
        {isRegistered && (
          <Badge variant="secondary" className="text-[10px]">
            Queued
          </Badge>
        )}
        {isFailed && (
          <Badge variant="destructive" className="text-[10px]">
            Failed
          </Badge>
        )}
        {isComplete && (
          <Badge variant="success" className="text-[10px]">
            Complete
          </Badge>
        )}
        {isProcessing && (
          <Badge variant="vermillion" className="text-[10px]">
            Processing
          </Badge>
        )}
      </div>

      {isProcessing && phaseLabel !== null && (
        <div className="mt-1 text-[11px]">
          <TextShimmer as="span" className="text-zinc-500">
            {`${phaseLabel}…`}
          </TextShimmer>
        </div>
      )}

      {(classificationLabel !== null || (isComplete && hasSavedResults)) && (
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-500">
          {classificationLabel !== null && <span>{classificationLabel}</span>}
          {isComplete && hasSavedResults && (
            <span>
              {writtenCount} result{writtenCount !== 1 ? 's' : ''} saved
            </span>
          )}
        </div>
      )}

      {isComplete && finalMessage !== null && !hasSavedResults && (
        <div className="mt-1 text-[11px] text-zinc-500">{finalMessage}</div>
      )}

      {isFailed && errorMessage !== null && (
        <div className="mt-1.5 rounded border border-red-200 bg-red-50 px-2 py-1 font-mono text-[10px] text-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
});
