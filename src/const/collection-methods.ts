import { CollectionMethodType } from '@/types/api';

export type CollectionOptionType = {
  name: string;
  value: CollectionMethodType;
  description: string;
  cancelationText?: string;
  price: number;
  disabled: boolean;
  pricingText?: string;
};

export const COLLECTION_METHODS: Record<
  'AT_HOME' | 'IN_LAB',
  CollectionOptionType
> = {
  IN_LAB: {
    name: 'Visit a lab near you',
    value: 'IN_LAB',
    description:
      'Perform testing at a partner clinic. We’ll help you find one close by at a time that works with your schedule.',
    price: 0,
    disabled: false,
  },
  AT_HOME: {
    name: 'Let us come to you',
    value: 'AT_HOME',
    description:
      'A licensed nurse will meet you when you’re ready at home, work, or wherever you are to perform your blood draw.',
    cancelationText: 'Late cancellation or rescheduling fees apply.',
    price: 9900,
    disabled: false,
  },
} as const;
