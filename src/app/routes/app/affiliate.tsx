import { ContentLayout } from '@/components/layouts';
import { Header } from '@/components/shared/header';
import { AffiliateLink } from '@/features/affiliate/components/affiliate-link';

export const AffiliateRoute = () => {
  return (
    <ContentLayout title="Invite friends & family">
      <Header title="Invite friends & family" />
      <AffiliateLink />
    </ContentLayout>
  );
};
