import { ContentLayout } from '@/components/layouts';
import { AffiliateLink } from '@/features/affiliate/components/affiliate-link';

export const AffiliateRoute = () => {
  return (
    <ContentLayout title="Invite friends & family" bgColor="zinc">
      <AffiliateLink />
    </ContentLayout>
  );
};
