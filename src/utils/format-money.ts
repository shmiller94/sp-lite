import { REQUESTABLE_SERVICES } from '@/const';
import { HealthcareService } from '@/types/api';

export const formatMoney = (
  amount: number,
  decimalPlaces: number = 0,
): string => {
  return (
    '$' +
    (amount / 100)
      .toFixed(decimalPlaces)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
};

export const getHealthcareServicePriceLabel = (
  healthcareService: HealthcareService,
) => {
  const hasItems = healthcareService.items.length > 0;
  const isFreeService = healthcareService.price === 0; // could also mean price was failed to load
  const isRequestable = REQUESTABLE_SERVICES.includes(healthcareService.name);

  if (hasItems) {
    return 'Price determined at checkout';
  }

  if (isFreeService) {
    return isRequestable ? 'Price on request' : 'Price unavailable';
  }

  return formatMoney(healthcareService.price);
};
