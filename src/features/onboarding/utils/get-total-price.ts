import { CollectionMethodType, HealthcareService } from '@/types/api';

export const getTotalPrice = (
  collectionMethod: CollectionMethodType,
  additionalServices: HealthcareService[],
  membershipPrice?: number,
  // bloodPackage?: BloodPackageType,
) => {
  let total = 0;

  for (const as of additionalServices) {
    total += as.price;
  }

  // TODO: add check for ADVANCED / BASELINE package

  // TODO: get this dynamically
  if (collectionMethod === 'AT_HOME') {
    total += 7900;
  }

  if (membershipPrice) {
    total += membershipPrice;
  }

  return total;
};
