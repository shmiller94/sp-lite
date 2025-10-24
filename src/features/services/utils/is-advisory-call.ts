import { ADVISORY_CALL } from '@/const';
import { HealthcareService } from '@/types/api';

const ADVISORY_KEYWORD = 'advisory call';
const NORMALIZED_ADVISORY_CALL = ADVISORY_CALL.trim().toLowerCase();

export const isAdvisoryCall = (
  service: Pick<HealthcareService, 'name'>,
): boolean => {
  const normalizedName = service.name.trim().toLowerCase();
  return (
    normalizedName === NORMALIZED_ADVISORY_CALL ||
    normalizedName.includes(ADVISORY_KEYWORD)
  );
};
