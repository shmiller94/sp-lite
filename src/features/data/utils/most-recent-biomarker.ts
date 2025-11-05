import { BiomarkerResult } from '@/types/api';

export const mostRecent = (
  values: BiomarkerResult[],
): BiomarkerResult | undefined => {
  if (!values || values.length === 0) return; // guard

  values = values.sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateB - dateA; // Sort in descending order based on issued date
  });

  return values[0]; // Return the most recent observation
};
