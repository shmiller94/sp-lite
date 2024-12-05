import { GetHealthScoresResponse } from '@/features/biomarkers/api/get-all-healthscores';
import { getStatusForScore } from '@/features/biomarkers/utils/get-status-for-score';
import { Biomarker, BiomarkerResult } from '@/types/api';

export const scoreBiomarker = (
  healthScores: GetHealthScoresResponse[],
  latestScore: number,
): Biomarker => {
  const latestStatus = getStatusForScore(latestScore);

  const values: BiomarkerResult[] = healthScores.map((hs) => ({
    quantity: {
      value: hs.healthScoreResult.finalScore,
      comparator: 'EQUALS',
      unit: 'points',
    },
    status: getStatusForScore(hs.healthScoreResult.finalScore),
    timestamp: hs.createdAt,
  }));

  return {
    id: 'score',
    name: 'Superpower Score',
    favorite: false,
    description: `Your Superpower score is the ultimate score of personal health as it takes into account every dimension of your health like health optimization, toxin levels, nutrition & gut and look & feel. We measure the score based on the average of your tests and data across different health markers.\n\nIf you don’t have enough data for certain markers, we don’t consider it in your Superpower score calculation.\n\nWhereas the more data you have the more accurate score we can provide.`,
    importance: '',
    category: 'Scoring',
    value: values,
    range: [
      {
        status: 'LOW',
        low: {
          value: 0,
          comparator: 'GREATER_THAN_EQUALS',
        },
        high: {
          value: 60,
          comparator: 'LESS_THAN',
        },
      },
      {
        status: 'NORMAL',
        high: {
          value: 80,
          comparator: 'LESS_THAN',
        },
        low: {
          value: 60,
          comparator: 'GREATER_THAN_EQUALS',
        },
      },
      {
        status: 'OPTIMAL',
        high: {
          value: 100,
          comparator: 'LESS_THAN_EQUALS',
        },
        low: {
          value: 80,
          comparator: 'GREATER_THAN_EQUALS',
        },
      },
    ],
    unit: 'points',
    metadata: {
      source: [],
      content: [],
    },
    status: latestStatus,
  };
};
