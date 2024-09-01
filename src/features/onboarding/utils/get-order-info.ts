import {
  GRAIL_GALLERI_MULTI_CANCER_TEST,
  GUT_MICROBIOME_ANALYSIS,
  TOTAL_TOXIN_TEST,
} from '@/const';
import { HealthcareService } from '@/types/api';

import { ScheduledSlots } from '../stores/onboarding-store';

export const getOrderInfo = (
  service: HealthcareService,
  slots: ScheduledSlots,
) => {
  switch (service.name) {
    case GRAIL_GALLERI_MULTI_CANCER_TEST:
      return {
        orderId: slots.cancer.orderId,
        timestamp: slots.cancer.slot?.start,
        timezone: slots.cancer.timezone,
      };
    case GUT_MICROBIOME_ANALYSIS:
      return {
        orderId: slots.microbiome.orderId,
        address: slots.microbiome.address,
      };
    case TOTAL_TOXIN_TEST:
      return {
        orderId: slots.toxin.orderId,
        address: slots.toxin.address,
      };
  }
};
