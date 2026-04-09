import { useMemo } from 'react';

import { useOrders } from '@/features/orders/api';
import { useCredits } from '@/features/orders/api/credits';
import { useWearables } from '@/features/settings/api/get-wearables';
import { useSummarySuspense } from '@/features/summary/api/get-summary';
import { useIsMobile } from '@/hooks/use-mobile';
import { OrderStatus } from '@/types/api';

import { useHomepageStore } from '../stores/homepage-store';
import { HomepageState, VisibleCard } from '../types';

/**
 * Hook to compute homepage state from various data sources
 * and return the visible cards based on that state
 */
export const useHomepageState = (): {
  state: HomepageState;
  visibleCards: VisibleCard[];
} => {
  const getVisibleCards = useHomepageStore((store) => store.getVisibleCards);

  const isMobile = useIsMobile();

  const { data: summaryData } = useSummarySuspense();

  // NOTE(Nikita): these should be coming from the summary endpoint most likely as well
  // NOTE: but credits and orders are highly dynamic...
  const { data: creditsData } = useCredits();
  const { data: ordersData } = useOrders();
  const { data: wearablesData } = useWearables();

  const state = useMemo<HomepageState>(() => {
    const summary = summaryData;
    const credits = creditsData?.credits ?? [];
    const requestGroups = ordersData?.requestGroups ?? [];

    // if there is no appointment type then its not a lab order
    const hasActiveLabOrders = requestGroups.some(
      (rg) =>
        rg.status === OrderStatus.active && rg.appointmentType !== undefined,
    );

    const hasActiveNonLabOrders = requestGroups.some(
      (rg) =>
        rg.status === OrderStatus.active && rg.appointmentType === undefined,
    );

    const connectedWearables =
      wearablesData?.wearables?.filter((w) => w.status === 'connected') ?? [];

    return {
      isMobile,
      hasActiveLabOrders,
      hasActionableOrders: credits.length > 0,
      hasCompletedActionPlan: summary.hasCompletedCarePlan,
      hasMultipleActionPlans: summary.completedCarePlans > 1,
      hasActiveNonLabOrders,
      hasNoWearables: connectedWearables.length === 0,
    };
  }, [summaryData, creditsData, ordersData, wearablesData, isMobile]);

  const visibleCards = useMemo(() => {
    return getVisibleCards(state);
  }, [getVisibleCards, state]);

  return { state, visibleCards };
};
