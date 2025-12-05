export type MarketplaceTabValue =
  | 'all'
  | 'tests'
  | 'supplements'
  | 'prescriptions'
  | 'orders';

export type MarketplaceCategoryKey =
  | 'BRAIN_AND_COGNITIVE_HEALTH'
  | 'IMMUNE_AND_INFLAMMATORY_HEALTH'
  | 'LIVER_HEALTH'
  | 'MUSCLE_BONE_AND_JOINT_HEALTH'
  | 'NUTRITION_AND_ENERGY'
  | 'CELLULAR_REPAIR_AND_HEALTHY_AGING'
  | 'METABOLIC_HEALTH'
  | 'GUT_HEALTH'
  | 'HEART_HEALTH'
  | 'HORMONE_AND_REPRODUCTIVE_HEALTH'
  | 'STRESS_SLEEP_AND_MOOD'
  | 'SKIN_HEALTH';

export type MarketplaceCategory = {
  key: MarketplaceCategoryKey;
  label: string;
  tags: readonly string[];
};

export const MARKETPLACE_CATEGORIES: readonly MarketplaceCategory[] = [
  {
    key: 'BRAIN_AND_COGNITIVE_HEALTH',
    label: 'Brain & Cognitive Health',
    tags: ['brain & cognitive health', 'brain', 'cognitive'],
  },
  {
    key: 'IMMUNE_AND_INFLAMMATORY_HEALTH',
    label: 'Immune & Inflammatory Health',
    tags: ['immune & inflammatory health', 'immune', 'inflammatory'],
  },
  {
    key: 'LIVER_HEALTH',
    label: 'Liver Health',
    tags: ['liver health', 'liver'],
  },
  {
    key: 'MUSCLE_BONE_AND_JOINT_HEALTH',
    label: 'Muscle Bone & Joint Health',
    tags: ['muscle bone & joint health', 'muscle', 'bone', 'joint'],
  },
  {
    key: 'NUTRITION_AND_ENERGY',
    label: 'Nutrition & Energy',
    tags: ['nutrition & energy', 'nutrition', 'energy'],
  },
  {
    key: 'CELLULAR_REPAIR_AND_HEALTHY_AGING',
    label: 'Cellular Repair & Healthy Aging',
    tags: [
      'cellular repair & healthy aging',
      'cellular repair',
      'healthy aging',
      'aging',
    ],
  },
  {
    key: 'METABOLIC_HEALTH',
    label: 'Metabolic Health',
    tags: ['metabolic health', 'metabolic'],
  },
  {
    key: 'GUT_HEALTH',
    label: 'Gut Health',
    tags: ['gut health', 'gut', 'microbiome'],
  },
  {
    key: 'HEART_HEALTH',
    label: 'Heart Health',
    tags: ['heart health', 'cardio', 'cardiovascular'],
  },
  {
    key: 'HORMONE_AND_REPRODUCTIVE_HEALTH',
    label: 'Hormone & Reproductive Health',
    tags: ['hormone & reproductive health', 'hormone', 'reproductive'],
  },
  {
    key: 'STRESS_SLEEP_AND_MOOD',
    label: 'Stress Sleep & Mood',
    tags: ['stress sleep & mood', 'stress', 'sleep', 'mood'],
  },
  {
    key: 'SKIN_HEALTH',
    label: 'Skin Health',
    tags: ['skin health', 'skin'],
  },
];

export type MarketplaceFilter = 'all' | MarketplaceCategoryKey;

export const MARKETPLACE_FILTER_OPTIONS: readonly MarketplaceFilter[] = [
  'all',
  ...MARKETPLACE_CATEGORIES.map((c) => c.key),
];
