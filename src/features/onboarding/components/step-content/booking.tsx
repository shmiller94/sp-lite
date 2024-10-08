import { AtHome, InLab, Event } from '@/features/onboarding/components/booking';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';

const Booking = () => {
  const { collectionMethod } = useOnboarding();

  if (collectionMethod === 'IN_LAB') {
    return <InLab />;
  }

  if (collectionMethod === 'EVENT') {
    return <Event />;
  }

  return <AtHome />;
};

export const BookingStep = () => (
  <ImageContentLayout title="Booking" className="bg-female-stretching">
    <Booking />
  </ImageContentLayout>
);
