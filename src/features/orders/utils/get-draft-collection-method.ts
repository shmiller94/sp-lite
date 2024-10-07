import { CollectionMethodType } from '@/types/api';

/**
 * Retrieves the first collection method from the provided array of draft order collection methods.
 *
 * @param {CollectionMethodType[]} draftOrderCollectionMethods - Optional array of collection methods for a draft order.
 * @returns {CollectionMethodType | undefined} - The first collection method if available; otherwise, undefined.
 */
export const getDraftCollectionMethod = (
  draftOrderCollectionMethods?: CollectionMethodType[],
): CollectionMethodType | undefined => {
  if (!draftOrderCollectionMethods) {
    return undefined;
  }

  if (draftOrderCollectionMethods.length > 0) {
    return draftOrderCollectionMethods[0];
  }

  return undefined;
};
