import { SplitScreenLayout } from '@/components/layouts';
import { UpsellBooking } from '@/features/onboarding/components/upsell';

export const UpsellBookingStep = () => (
  <SplitScreenLayout title="Book additional services" className="bg-zinc-50">
    <UpsellBooking />
  </SplitScreenLayout>
);
