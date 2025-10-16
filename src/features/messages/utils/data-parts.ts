import type { DataUIPart } from 'ai';

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
