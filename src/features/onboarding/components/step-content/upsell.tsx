import 'moment-timezone';

import { SplitScreenLayout } from '@/components/layouts';
import { UpsellSequence } from '@/features/onboarding/components/upsell';

export const UpsellStep = () => (
  <SplitScreenLayout title="Additional services" className="bg-zinc-50">
    <UpsellSequence />
  </SplitScreenLayout>
);
