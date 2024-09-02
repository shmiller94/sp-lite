export const CATEGORY_OPTIONS = [
  {
    label: 'Aging',
    value: 'aging',
  },
  {
    label: 'Blood and Oxygen',
    value: 'blood and oxygen',
  },
  {
    label: 'Cardiometabolic',
    value: 'cardiometabolic',
  },
  {
    label: 'Hormones',
    value: 'hormones',
  },
  {
    label: 'Liver & Kidney Health',
    value: 'liver and kidney health',
  },
  {
    label: 'Nutrition & Inflammation',
    value: 'nutrition and inflammation',
  },
  {
    label: 'Toxins',
    value: 'toxins',
  },
];

export const STATUS_OPTIONS = [
  {
    label: 'All Ranges',
    value: '',
    description: 'No range filter',
    color: 'zinc-300',
  },
  {
    label: 'Optimal',
    value: 'optimal',
    description: 'Ideal range for peak body function',
    color: 'green-400',
  },
  {
    label: 'Normal',
    value: 'normal',
    description: 'Borderline suboptimal',
    color: 'yellow-300',
  },
  {
    label: 'Out of Range',
    value: 'high low',
    description: 'May require further attention',
    color: 'fuchsia-400',
  },
];

export type ToolbarCategoryType =
  | 'Blood'
  | 'Genetic'
  | 'Gut'
  | 'Toxins'
  | 'Allergies'
  | 'VO2 Max'
  | 'Cancer'
  | 'Glucose'
  | 'MRI'
  | 'DEXA';

export const TOOLBAR_CATEGORIES: { name: ToolbarCategoryType }[] = [
  {
    name: 'Blood',
  },
  {
    name: 'Genetic',
  },
  {
    name: 'Gut',
  },
  {
    name: 'Toxins',
  },
  {
    name: 'Allergies',
  },
  {
    name: 'VO2 Max',
  },
  {
    name: 'Cancer',
  },
  {
    name: 'Glucose',
  },
  {
    name: 'MRI',
  },
  {
    name: 'DEXA',
  },
];
