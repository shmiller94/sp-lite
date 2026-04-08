import type { DataUIPart } from 'ai';

import type { FileUploadClassification } from '@/types/api';

export type FollowupDataPart = DataUIPart<Record<string, unknown>> & {
  type: 'data-followup';
  data: string;
};

export function isFollowupDataPart(
  part: DataUIPart<Record<string, unknown>>,
): part is FollowupDataPart {
  return (
    part?.type === 'data-followup' &&
    typeof (part as { data: unknown }).data === 'string'
  );
}

export function getFollowupString(
  part: DataUIPart<Record<string, unknown>>,
): string | null {
  return isFollowupDataPart(part) ? part.data : null;
}

export interface FileIngestionData {
  fileId: string;
  filename: string | null;
  state: 'processing' | 'complete';
  status: 'registered' | 'processing' | 'final' | 'failed';
  phase: 'classifying' | 'extracting' | 'validating' | 'writing' | null;
  classification: FileUploadClassification | null;
  writtenCount: number | null;
  message: string | null;
  error: string | null;
}

export type FileIngestionDataPart = DataUIPart<Record<string, unknown>> & {
  type: 'data-file-ingestion';
  data: FileIngestionData;
};

export function isFileIngestionDataPart(
  part: unknown,
): part is FileIngestionDataPart {
  if (typeof part !== 'object' || part === null) return false;
  const p = part as { type?: string; data?: { fileId?: unknown } };
  return p.type === 'data-file-ingestion' && typeof p.data?.fileId === 'string';
}

export interface CompactionDataInProgress {
  state: 'in-progress';
  reason: 'threshold' | 'overflow';
  startedAt: string;
  tokensBefore: number;
}

export interface CompactionDataComplete {
  state: 'complete';
  reason: 'threshold' | 'overflow';
  startedAt: string;
  completedAt: string;
  chatSummaryId: string;
  summary: string;
  tokensBefore: number;
  tokensAfter: number;
}

export type CompactionData = CompactionDataInProgress | CompactionDataComplete;

export type CompactionDataPart = DataUIPart<Record<string, unknown>> & {
  type: 'data-compaction';
  data: CompactionData;
};

export function isCompactionDataPart(
  part: unknown,
): part is CompactionDataPart {
  if (typeof part !== 'object' || part === null) return false;
  const p = part as { type?: string; data?: { state?: unknown } };
  return (
    p.type === 'data-compaction' &&
    typeof p.data?.state === 'string' &&
    (p.data.state === 'in-progress' || p.data.state === 'complete')
  );
}
