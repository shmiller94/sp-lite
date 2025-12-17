import { COLLECTION_METHODS, type CollectionOptionType } from '@/const';
import { useUser } from '@/lib/auth';
import { useAuthorization } from '@/lib/authorization';

import { useUpgradeCreditPrice } from '../api/credits/get-upgrade-credit-price';

/**
 * Returns a list of collection methods available for the given service and draft order.
 *
 * @param primaryAddress - Primary address of user
 * @param isAdmin - Whether the user is an admin
 * @returns {CollectionOptionType[]} An array of available collection methods.
 */
export const useCollectionMethods = ({
  creditIds,
}: {
  creditIds?: string[];
} = {}): CollectionOptionType[] => {
  const { data: user } = useUser({
    refetchOnMount: true,
  });
  const { checkAdminActorAccess } = useAuthorization();
  const isAdmin = checkAdminActorAccess();
  const upgradePriceQuery = useUpgradeCreditPrice({
    upgradeType: 'at-home',
    creditIds,
  });

  const primaryAddress = user?.primaryAddress;
  const upgradePrice = upgradePriceQuery.data?.price ?? 0;

  // helper function to create collection method options with proper pricing
  const createInLabOption = (overrides: Partial<CollectionOptionType> = {}) => {
    const inLabOption = { ...COLLECTION_METHODS.IN_LAB, ...overrides };

    return {
      ...inLabOption,
    };
  };

  // helper function to create collection method options with proper pricing
  const createAtHomedOption = (
    overrides: Partial<CollectionOptionType> = {},
  ) => {
    const atHomeOption = { ...COLLECTION_METHODS.AT_HOME, ...overrides };

    return {
      ...atHomeOption,
    };
  };

  if (!primaryAddress?.state) {
    return [];
  }

  // If user is admin, allow in-lab options regardless of state
  if (isAdmin) {
    return [createInLabOption(), createAtHomedOption({ price: upgradePrice })];
  }

  return [createInLabOption(), createAtHomedOption({ price: upgradePrice })];
};
