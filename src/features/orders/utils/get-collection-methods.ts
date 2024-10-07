import { CUSTOM_BLOOD_PANEL, SUPERPOWER_BLOOD_PANEL } from '@/const';
import { COLLECTION_METHODS } from '@/features/orders/const/collection-methods';
import { CollectionOptionType } from '@/features/orders/types/collection-method';
import { getDraftCollectionMethod } from '@/features/orders/utils/get-draft-collection-method';
import { getInterpretedAtHomeMethod } from '@/features/orders/utils/get-interpreted-method';
import { HealthcareService, Order } from '@/types/api';

/**
 * Returns a list of collection methods available for the given service and draft order.
 *
 * @param {HealthcareService} service - The healthcare service for which to get the collection methods.
 * @param {Order} [draftOrder] - An optional draft order that may influence the available collection methods.
 * @returns {CollectionOptionType[]} An array of available collection methods.
 */
export const getCollectionMethods = (
  service: HealthcareService,
  draftOrder: Order | null,
): CollectionOptionType[] => {
  const isBloodPanel =
    service.name === SUPERPOWER_BLOOD_PANEL ||
    service.name === CUSTOM_BLOOD_PANEL;
  const AT_HOME = getInterpretedAtHomeMethod(service);

  if (draftOrder) {
    const collectionMethod = getDraftCollectionMethod(draftOrder.method);

    if (collectionMethod) {
      return collectionMethod === 'IN_LAB'
        ? [COLLECTION_METHODS.IN_LAB, AT_HOME]
        : [AT_HOME];
    }
  }

  if (!isBloodPanel) {
    return [AT_HOME];
  }

  return [COLLECTION_METHODS.IN_LAB, AT_HOME];
};
