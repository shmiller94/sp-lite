import { CollectionMethodType } from '@/types/api';

export type OnboardingLocation = {
  displayName: string;
  description: string;
  price: number;
  type: CollectionMethodType;
};
