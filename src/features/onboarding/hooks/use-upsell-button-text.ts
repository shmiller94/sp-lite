import { useMemo } from 'react';

import { ServiceWithMetadata } from './use-upsell-services';

interface UseUpsellButtonTextProps {
  isPending: boolean;
  selectedServices: ServiceWithMetadata[];
  existingOrders: boolean;
}

export const useUpsellButtonText = ({
  isPending,
  selectedServices,
  existingOrders,
}: UseUpsellButtonTextProps) => {
  const buttonText = useMemo(() => {
    if (isPending) {
      return 'Confirming…';
    }

    if (selectedServices.length > 0) {
      return 'Book additional tests';
    }

    if (existingOrders && selectedServices.length === 0) {
      return 'Confirm booking details';
    }

    if (!existingOrders && selectedServices.length === 0) {
      return 'Continue without additional tests';
    }

    return '';
  }, [isPending, selectedServices.length, existingOrders]);

  return { buttonText };
};
