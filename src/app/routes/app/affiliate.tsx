import { ContentLayout } from '@/components/layouts';
import { H1 } from '@/components/ui/typography';
import { AffiliateLink } from '@/features/affiliate/components/affiliate-link';

export const AffiliateRoute = () => {
  return (
    <ContentLayout title="Invite friends & family">
      <H1>Invite friends & family</H1>
      <AffiliateLink />
    </ContentLayout>
  );
};
