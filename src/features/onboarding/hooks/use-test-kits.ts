import { useCallback, useMemo } from 'react';

import {
  ENVIRONMENTAL_TOXIN_TEST_ID,
  GUT_MICROBIOME_ANALYSIS_ID,
  HEAVY_METALS_TEST_ID,
  MYCOTOXINS_TEST_ID,
  TOTAL_TOXIN_TEST_ID,
} from '@/const/services';
import { useTestKitStore } from '@/features/onboarding/stores/test-kit-store';
import { useOrders } from '@/features/orders/api';
import { useServices } from '@/features/services/api/get-services';
import { useAnalytics } from '@/hooks/use-analytics';
import { HealthcareService, Order } from '@/types/api';

export const SERVICE_METADATA = {
  [MYCOTOXINS_TEST_ID]: {
    displayName: 'Mold Toxicity',
    description:
      'Learn how mold levels from environmental or dietary may be harming your health.',
    image_transparent: '/onboarding/upsell/transparent/mold_toxicity.webp',
    image_shadow: '/onboarding/upsell/shadow/mold_toxicity.webp',
  },
  [HEAVY_METALS_TEST_ID]: {
    displayName: 'Mercury Poisoning',
    description:
      'Identify and address toxic metals that maybe damaging your body.',
    image_transparent: '/onboarding/upsell/transparent/mercury_poisoning.webp',
    image_shadow: '/onboarding/upsell/shadow/mercury_poisoning.webp',
  },
  [ENVIRONMENTAL_TOXIN_TEST_ID]: {
    displayName: 'BPA Plastics and Pesticides',
    description:
      'Uncover hidden chemical exposures that could be draining your health.',
    image_transparent:
      '/onboarding/upsell/transparent/bpa_plastics_pesticides.webp',
    image_shadow: '/onboarding/upsell/shadow/bpa_plastics_pesticides.webp',
  },
  [GUT_MICROBIOME_ANALYSIS_ID]: {
    displayName: 'Gut Microbiome',
    description: 'Learn how your gut microbiome may be affecting your health.',
    image_transparent: '/onboarding/upsell/transparent/gut_microbiome.webp',
    image_shadow: '/onboarding/upsell/shadow/gut_microbiome.webp',
  },
};

export type ServiceWithMetadata = HealthcareService & {
  displayName: string;
  description: string;
  image_transparent: string;
  image_shadow: string;
  savings?: number;
  order?: Order;
};

type UseTestKitServicesReturn = {
  services: ServiceWithMetadata[];
  selectedServices: ServiceWithMetadata[];
  selectService: (service: ServiceWithMetadata) => void;
  isLoading: boolean;
};
export const TOXIN_TEST_IDS = [
  MYCOTOXINS_TEST_ID,
  HEAVY_METALS_TEST_ID,
  ENVIRONMENTAL_TOXIN_TEST_ID,
];

export const UPSELL_SERVICE_IDS = [
  ...TOXIN_TEST_IDS,
  GUT_MICROBIOME_ANALYSIS_ID,
];

export const useTestKitServices = (): UseTestKitServicesReturn => {
  const { data, isLoading: isServicesLoading } = useServices();
  const { data: ordersData, isLoading: isOrdersLoading } = useOrders();
  const { track } = useAnalytics();
  const { selectedServiceIds, toggleService } = useTestKitStore((s) => ({
    selectedServiceIds: s.selectedServiceIds,
    toggleService: s.toggleService,
  }));

  const order = useCallback(
    (serviceId: string) => {
      return ordersData?.requestGroups
        ?.flatMap((rg) => rg.orders)
        ?.find((order) => order.serviceId === serviceId);
    },
    [ordersData?.requestGroups],
  );

  const services = useMemo(() => {
    const filteredServices =
      data?.services
        ?.filter((service) => UPSELL_SERVICE_IDS.includes(service.id))
        ?.map((service) => ({
          ...service,
          ...SERVICE_METADATA[service.id as keyof typeof SERVICE_METADATA],
          order: order(service.id),
        })) ?? [];

    // Sort the filtered services
    return filteredServices.sort((a, b) => {
      const sortOrder = {
        [GUT_MICROBIOME_ANALYSIS_ID]: 0,
        [TOTAL_TOXIN_TEST_ID]: 1,
        [MYCOTOXINS_TEST_ID]: 2,
        [HEAVY_METALS_TEST_ID]: 3,
        [ENVIRONMENTAL_TOXIN_TEST_ID]: 4,
      };

      const aOrd = sortOrder[a.id as keyof typeof sortOrder] ?? 999;
      const bOrd = sortOrder[b.id as keyof typeof sortOrder] ?? 999;

      return aOrd - bOrd;
    });
  }, [data?.services, order]);

  const trackAddedToCart = useCallback(
    (svc: ServiceWithMetadata) => {
      track('service_added_to_cart', {
        service_id: svc.id,
        service_name: svc.name,
        value: svc.price,
      });
    },
    [track],
  );

  const selectedServices = useMemo(() => {
    return services
      .filter((s) => selectedServiceIds.includes(s.id))
      .map((service) => ({
        ...service,
        ...SERVICE_METADATA[service.id as keyof typeof SERVICE_METADATA],
        order: order(service.id),
      }));
  }, [services, selectedServiceIds, order]);

  const selectService = (service: ServiceWithMetadata) => {
    const isSelected = selectedServiceIds.includes(service.id);

    // Deselecting simple toggle
    if (isSelected) {
      toggleService(service.id);
      track('service_removed_from_cart', {
        service_id: service.id,
        service_name: service.name,
        service_price: service.price,
      });
      return;
    }

    toggleService(service.id);
    trackAddedToCart(service);
  };

  return {
    services,
    selectedServices,
    selectService,
    isLoading: isServicesLoading || isOrdersLoading,
  };
};
