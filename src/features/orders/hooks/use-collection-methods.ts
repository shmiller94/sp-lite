import { useEffect, useRef } from 'react';

import { COLLECTION_METHODS, type CollectionOptionType } from '@/const';
import { useUser } from '@/lib/auth';
import { useAuthorization } from '@/lib/authorization';

import { useUpgradeCreditPrice } from '../api/credits/get-upgrade-credit-price';

/**
 * Returns a list of collection methods available for the given service and draft order.
 *
 * @remarks
 * Right after login, `/auth/me` can occasionally return without `primaryAddress`.
 * We defensively:
 * - derive it from `user.address` when possible
 * - trigger a one-time refetch before concluding it's missing
 */
interface UseCollectionMethodsResult {
  options: CollectionOptionType[];
  isLoading: boolean;
  showMissingPrimaryAddress: boolean;
}

export const useCollectionMethods = ({
  creditIds,
}: {
  creditIds?: string[];
} = {}): UseCollectionMethodsResult => {
  const userQuery = useUser();
  const user = userQuery.data;
  const refetchUser = userQuery.refetch;
  const { checkAdminActorAccess } = useAuthorization();
  const isAdmin = checkAdminActorAccess();
  const upgradePriceQuery = useUpgradeCreditPrice({
    upgradeType: 'at-home',
    creditIds,
  });

  let primaryAddress = user?.primaryAddress;
  if (primaryAddress == null && user?.address != null) {
    for (const address of user.address) {
      if (address.use === 'home') {
        primaryAddress = address;
        break;
      }
    }
  }

  const hasPrimaryState =
    primaryAddress?.state != null && primaryAddress.state.length > 0;

  const hasAttemptedRefetchRef = useRef(false);
  const shouldAttemptRefetch =
    userQuery.isSuccess && !hasPrimaryState && !hasAttemptedRefetchRef.current;

  useEffect(() => {
    if (!shouldAttemptRefetch) {
      return;
    }

    hasAttemptedRefetchRef.current = true;
    void refetchUser();
  }, [shouldAttemptRefetch, refetchUser]);

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

  const isLoading =
    userQuery.isLoading ||
    (userQuery.isFetching && !hasPrimaryState) ||
    shouldAttemptRefetch;
  if (!hasPrimaryState) {
    if (isLoading) {
      return {
        options: [],
        isLoading: true,
        showMissingPrimaryAddress: false,
      };
    }

    return {
      options: [],
      isLoading: false,
      showMissingPrimaryAddress: userQuery.isSuccess,
    };
  }

  // If user is admin, allow in-lab options regardless of state
  if (isAdmin) {
    return {
      options: [
        createInLabOption(),
        createAtHomedOption({ price: upgradePrice }),
      ],
      isLoading,
      showMissingPrimaryAddress: false,
    };
  }

  return {
    options: [
      createInLabOption(),
      createAtHomedOption({ price: upgradePrice }),
    ],
    isLoading,
    showMissingPrimaryAddress: false,
  };
};
