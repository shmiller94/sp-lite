import { CollectionMethodType } from '@/types/api';

export type CollectionOptionType = {
  name: string;
  value: CollectionMethodType;
  description: string;
  cancelationText?: string;
  price: number;
};
