export const GRAIL_GALLERI_MULTI_CANCER_TEST =
  'Grail Galleri Multi Cancer Test';
export const GRAIL_GALLERI_MULTI_CANCER_TEST_ID =
  'grail-galleri-multi-cancer-test';

export const GUT_MICROBIOME_ANALYSIS = 'Gut Microbiome Analysis';
export const GUT_MICROBIOME_ANALYSIS_ID = 'gut-microbiome-analysis';

export const TOTAL_TOXIN_TEST = 'Total Toxins';
export const TOTAL_TOXIN_TEST_ID = 'total-toxins';

export const SUPERPOWER_BLOOD_PANEL = 'Superpower Blood Panel';
export const SUPERPOWER_BLOOD_PANEL_ID = 'v2-baseline-blood-panel-quest';

export const SUPERPOWER_ADVANCED_BLOOD_PANEL = 'Advanced Blood Panel';
export const SUPERPOWER_ADVANCED_BLOOD_PANEL_ID =
  'v2-advanced-blood-panel-quest';

export const ADVISORY_CALL = '1-1 Advisory Call';
export const ADVISORY_CALL_ID = '1-1-advisory-call';

export const PFAS_CHEMICALS = 'PFAS Chemicals';
export const PFAS_CHEMICALS_ID = 'pfas-chemicals';

export const INTESTINAL_PERMEABILITY_PANEL = 'Intestinal Permeability Panel';
export const INTESTINAL_PERMEABILITY_PANEL_ID = 'intestinal-permeability-panel';

export const FOOD_ENVIRONMENTAL_ALLERGY =
  'Food & Environmental Allergy Testing';
export const FOOD_ENVIRONMENTAL_ALLERGY_ID =
  'food-and-environmental-allergy-testing';

export const FULL_GENETIC_SEQUENCING = 'Full Genetic Sequencing';
export const FULL_GENETIC_SEQUENCING_ID = 'full-genetic-sequencing';

export const HEART_CALCIUM_SCAN = 'Heart Calcium Scan';
export const HEART_CALCIUM_SCAN_ID = 'heart-calcium-scan';

export const DEXA_SCAN = 'DEXA Scan';
export const DEXA_SCAN_ID = 'dexa-scan';

export const VO2_MAX_TEST = 'VO2 Max Test';
export const VO2_MAX_TEST_ID = 'vo2-max-test';

export const FULL_BODY_MRI = 'Full Body MRI';
export const FULL_BODY_MRI_ID = 'full-body-mri';

export const CONTINUOUS_GLUCOSE_MONITOR = 'Continuous Glucose Monitor';
export const CONTINUOUS_GLUCOSE_MONITOR_ID = 'continuous-glucose-monitor';

export const CUSTOM_BLOOD_PANEL = 'Custom Blood Panel';
export const CUSTOM_BLOOD_PANEL_ID = 'custom-blood-panel';

export const MYCOTOXINS_TEST = 'Mycotoxins';
export const MYCOTOXINS_TEST_ID = 'mycotoxins';

export const ENVIRONMENTAL_TOXIN_TEST = 'Environmental Toxin';
export const ENVIRONMENTAL_TOXIN_TEST_ID = 'environmental-toxin';

export const ENVIRONMENTAL_TOXINS = 'Environmental Toxins';
export const ENVIRONMENTAL_TOXINS_ID = 'environmental-toxins';

export const HEAVY_METALS_TEST = 'Heavy Metals';
export const HEAVY_METALS_TEST_ID = 'heavy-metals';

export const ADVANCED_BLOOD_PANEL = 'Advanced Blood Panel';
export const ADVANCED_BLOOD_PANEL_ID = 'v2-advanced-blood-panel-quest';

export const IV_DRIP = 'IV Drip';
export const IV_DRIP_ID = 'iv-drip';

export const READY_NUM_HOURS_BEFORE_ADVISORY = 2;

export enum ServiceTypeEnum {
  Baseline = 'v2-baseline',
  Advanced = 'v2-advanced',
}
export type ServiceType = ServiceTypeEnum;

export enum ServiceLabTypeEnum {
  Labcorp = 'labcorp',
  Quest = 'quest',
  Bioref = 'bioref',
}
export type ServiceLabType = ServiceLabTypeEnum;

// side note we dont have a good way right now to get individual charge items from server
// so we just stick to that approach
export const UPGRADE_PRICE = 18900;
export const UPGRADE_PRICE_NYNJ = 19900;

export const isBloodPanel = (serviceName: string) => {
  return (
    serviceName === SUPERPOWER_BLOOD_PANEL ||
    serviceName === CUSTOM_BLOOD_PANEL ||
    serviceName === ADVANCED_BLOOD_PANEL
  );
};
