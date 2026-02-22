import { lazy } from 'react';

export const LazyStripeProvider = lazy(() =>
  import('@/lib/stripe').then((mod) => ({ default: mod.StripeProvider })),
);
