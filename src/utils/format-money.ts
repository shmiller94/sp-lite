import { REQUESTABLE_SERVICES } from '@/const';
import { HealthcareService } from '@/types/api';

const addThousandSeparators = (value: string): string =>
  value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export const formatMoney = (amount: number, decimalPlaces?: number): string => {
  const dollars = amount / 100;

  if (decimalPlaces !== undefined) {
    return '$' + addThousandSeparators(dollars.toFixed(decimalPlaces));
  }

  return '$' + addThousandSeparators(dollars.toFixed(0));
};

export const getHealthcareServicePriceLabel = (
  healthcareService: HealthcareService,
) => {
  const isFreeService = healthcareService.price === 0; // could also mean price was failed to load
  const isRequestable = REQUESTABLE_SERVICES.includes(healthcareService.name);

  if (isFreeService) {
    return isRequestable ? 'Price on request' : 'Price unavailable';
  }

  return formatMoney(healthcareService.price);
};
