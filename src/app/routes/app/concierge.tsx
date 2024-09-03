import { ContentLayout } from '@/components/layouts';
import { CreateMessage } from '@/features/messages/components/create-message';

export const ConciergeRoute = () => {
  return (
    <ContentLayout title="Concierge" bgColor="zinc">
      <CreateMessage />
    </ContentLayout>
  );
};
