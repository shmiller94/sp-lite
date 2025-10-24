import { RECOMMENDED_SERVICES } from '@/const';
import { HealthcareService } from '@/types/api';

export const getRecommendedServices = (
  services: HealthcareService[] = [],
): HealthcareService[] => {
  if (!services.length) {
    return [];
  }

  return RECOMMENDED_SERVICES.map((name) =>
    services.find((service) => service.name === name),
  ).filter((service): service is HealthcareService => Boolean(service));
};
