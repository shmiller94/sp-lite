import { ContentLayout } from '@/components/layouts';
import { Header } from '@/components/shared/header';
import { MarketplaceOrdersButton } from '@/features/marketplace/components/marketplace-orders-button';
import { MarketplaceTabs } from '@/features/marketplace/components/marketplace-tabs';

export const MarketplaceRoute = () => {
  return (
    <ContentLayout
      title="Marketplace"
      className="max-w-[1453px] py-0 md:space-y-6"
    >
      <Header
        title="Marketplace"
        callToAction={<MarketplaceOrdersButton />}
        className="hidden md:flex"
      />
      <section id="marketplace" className="space-y-6">
        <MarketplaceTabs />
      </section>
    </ContentLayout>
  );
};
