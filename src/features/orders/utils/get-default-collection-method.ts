import { ADVISORY_CALL, GUT_MICROBIOME_ANALYSIS } from '@/const';
import { CollectionMethodType, HealthcareService } from '@/types/api';

/**
 * Determines the default collection method for a healthcare service.
 *
 * @param {HealthcareService} service - The healthcare service object that contains details such as name and phlebotomy requirements.
 * @returns {CollectionMethodType | null} The default collection method type, or `null` if none is applicable.
 *
 * @example
 * // Returns 'IN_LAB'
 * const collectionMethod = getDefaultCollectionMethod({
 *   name: 'Superpower Blood panel',
 * });
 *
 * // Returns null for advisory calls
 * const collectionMethod = getDefaultCollectionMethod({
 *   name: 'Advisory Call',
 * });
 */
export const getDefaultCollectionMethod = (
  service: HealthcareService,
): CollectionMethodType | null => {
  /*
   * Extend with more services if needed
   * */
  if (
    service.name === ADVISORY_CALL ||
    service.name === GUT_MICROBIOME_ANALYSIS
  ) {
    return null;
  }

  if (!service.supportsLabOrder && service.phlebotomy) {
    return 'PHLEBOTOMY_KIT';
  }

  return service.phlebotomy && service.supportsLabOrder ? 'IN_LAB' : 'AT_HOME';
};
