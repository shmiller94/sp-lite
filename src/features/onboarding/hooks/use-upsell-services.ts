import { useCallback, useMemo, useState } from 'react';

import {
  ENVIRONMENTAL_TOXIN_TEST_ID,
  GUT_MICROBIOME_ANALYSIS_ID,
  HEAVY_METALS_TEST_ID,
  MYCOTOXINS_TEST_ID,
  TOTAL_TOXIN_TEST_ID,
} from '@/const/services';
import { useOrders } from '@/features/orders/api';
import { useServices } from '@/features/services/api/get-services';
import { HealthcareService, Order } from '@/types/api';

export const SERVICE_METADATA = {
  [TOTAL_TOXIN_TEST_ID]: {
    displayName: 'Total Toxin Test - Bundle',
    description: `- Mold Toxicity
- Mercury Poisoning
- BPA Plastics & Pesticides`,
    image_transparent: '/onboarding/upsell/transparent/total_toxin.webp',
    image_shadow: '/onboarding/upsell/shadow/total_toxin.webp',
    savings: 47000, // $470
  },
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

type UseUpsellServicesReturn = {
  services: ServiceWithMetadata[];
  selectedServices: ServiceWithMetadata[];
  setSelectedServices: (service: ServiceWithMetadata) => void;
  isLoading: boolean;
};

export const useUpsellServices = (): UseUpsellServicesReturn => {
  const { data, isLoading } = useServices();
  const { data: ordersData } = useOrders();
  const [selected, setSelectedServices] = useState<ServiceWithMetadata[]>([]);

  const order = useCallback(
    (serviceId: string) => {
      return ordersData?.orders?.find((order) => order.serviceId === serviceId);
    },
    [ordersData?.orders],
  );

  const services = useMemo(() => {
    // Filter to only include toxins and gut services
    const allowedServiceIds = [
      TOTAL_TOXIN_TEST_ID,
      MYCOTOXINS_TEST_ID,
      HEAVY_METALS_TEST_ID,
      ENVIRONMENTAL_TOXIN_TEST_ID,
      GUT_MICROBIOME_ANALYSIS_ID,
    ];

    const filteredServices =
      data?.services
        ?.filter((service) => allowedServiceIds.includes(service.id))
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

  const selectedServices = useMemo(() => {
    return selected.map((service) => ({
      ...service,
      ...SERVICE_METADATA[service.id as keyof typeof SERVICE_METADATA],
      order: order(service.id),
    }));
  }, [selected, order]);

  // Individual toxin test IDs
  const individualToxinTestIds = [
    MYCOTOXINS_TEST_ID,
    HEAVY_METALS_TEST_ID,
    ENVIRONMENTAL_TOXIN_TEST_ID,
  ];

  const handleServiceSelection = (service: ServiceWithMetadata) => {
    setSelectedServices((prevSelected) => {
      const isCurrentlySelected = prevSelected.some((s) => s.id === service.id);

      // If deselecting, remove the service
      if (isCurrentlySelected) {
        return prevSelected.filter((s) => s.id !== service.id);
      }

      if (service.id === TOTAL_TOXIN_TEST_ID) {
        // If selecting total toxins, remove all individual toxin tests and add total toxins
        return [
          ...prevSelected.filter(
            (s) => !individualToxinTestIds.includes(s.id as any),
          ),
          service,
        ];
      } else if (individualToxinTestIds.includes(service.id as any)) {
        // If selecting an individual toxin test, remove total toxins first, then add the individual test
        const filtered = prevSelected.filter(
          (s) => s.id !== TOTAL_TOXIN_TEST_ID,
        );
        const newSelection = [...filtered, service];

        // Check if all three individual toxin tests are now selected
        const selectedIndividualTests = newSelection.filter((s) =>
          individualToxinTestIds.includes(s.id as any),
        );

        if (selectedIndividualTests.length === individualToxinTestIds.length) {
          // If all individual toxin tests are selected, remove them and add total toxins
          const totalToxinService = services?.find(
            (s) => s.id === TOTAL_TOXIN_TEST_ID,
          );
          if (totalToxinService) {
            return [totalToxinService];
          }
        }

        return newSelection;
      } else {
        return [...prevSelected, service];
      }
    });
  };

  return {
    services,
    selectedServices,
    setSelectedServices: handleServiceSelection,
    isLoading,
  };
};
