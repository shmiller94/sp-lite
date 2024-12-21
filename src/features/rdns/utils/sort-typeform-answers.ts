import { Answer } from '@/types/api';

/**
 * RDNs wanted the answers to height and weight questions to appear at the
 * top of the list of answers.
 */
export const sortTypeformAnswers = (answers: Answer[]): Answer[] => {
  const heightKey = 'height';
  const weightKey = 'weight';

  return answers.sort((a: Answer, b: Answer) => {
    const qa = a.question.toLowerCase();
    const qb = b.question.toLowerCase();

    const isHeightA = qa.includes(heightKey);
    const isHeightB = qb.includes(heightKey);
    const isWeightA = qa.includes(weightKey);
    const isWeightB = qb.includes(weightKey);

    // Prioritize 'height' over 'weight'
    if (isHeightA && !isHeightB) return -1;
    if (!isHeightA && isHeightB) return 1;

    // If neither contains 'height', prioritize 'weight'
    if (isWeightA && !isWeightB) return -1;
    if (!isWeightA && isWeightB) return 1;

    // Maintain original order otherwise
    return 0;
  });
};
