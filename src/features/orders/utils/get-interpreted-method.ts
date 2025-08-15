import {
  ADVANCED_BLOOD_PANEL,
  COLLECTION_METHODS,
  type CollectionOptionType,
  CUSTOM_BLOOD_PANEL,
  SUPERPOWER_BLOOD_PANEL,
} from '@/const';
import { HealthcareService } from '@/types/api';

/**
 * Returns the interpreted 'At Home' collection method based on the service.
 *
 * If the service is not a blood panel, the method is adjusted to 'PHLEBOTOMY_KIT'.
 *
 * @param {HealthcareService} service - The healthcare service to interpret.
 * @returns {CollectionOptionType} The interpreted 'At Home' collection method.
 */
export const getInterpretedAtHomeMethod = (
  service: HealthcareService,
): CollectionOptionType => {
  const isBloodPanel =
    service.name === SUPERPOWER_BLOOD_PANEL ||
    service.name === CUSTOM_BLOOD_PANEL ||
    service.name == ADVANCED_BLOOD_PANEL;

  if (!isBloodPanel) {
    return {
      ...COLLECTION_METHODS.AT_HOME,
      value: 'PHLEBOTOMY_KIT',
    };
  }
  return COLLECTION_METHODS.AT_HOME;
};
