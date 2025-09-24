import {
  CONTINUOUS_GLUCOSE_MONITOR,
  DEXA_SCAN,
  ENVIRONMENTAL_TOXINS,
  FOOD_ENVIRONMENTAL_ALLERGY,
  FULL_BODY_MRI,
  FULL_GENETIC_SEQUENCING,
  GRAIL_GALLERI_MULTI_CANCER_TEST,
  GUT_MICROBIOME_ANALYSIS,
  SUPERPOWER_BLOOD_PANEL,
  VO2_MAX_TEST,
} from '@/const';
import { ToolbarCategoryType } from '@/features/biomarkers/types/filters';

export const getHealthcareServiceFromCategory = (
  category: ToolbarCategoryType,
): string => {
  switch (category) {
    case 'Allergies':
      return FOOD_ENVIRONMENTAL_ALLERGY;
    case 'Blood':
      return SUPERPOWER_BLOOD_PANEL;
    case 'Cancer':
      return GRAIL_GALLERI_MULTI_CANCER_TEST;
    case 'Gut':
      return GUT_MICROBIOME_ANALYSIS;
    case 'Glucose':
      return CONTINUOUS_GLUCOSE_MONITOR;
    case 'DEXA':
      return DEXA_SCAN;
    case 'Genetic':
      return FULL_GENETIC_SEQUENCING;
    case 'MRI':
      return FULL_BODY_MRI;
    case 'Toxins':
      return ENVIRONMENTAL_TOXINS;
    case 'VO2 Max':
      return VO2_MAX_TEST;
  }
};
