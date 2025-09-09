import { Body1, H3 } from '@/components/ui/typography';

import { AffiliateLink } from './affiliate-link';
import { FAQSection } from './faq-section';
import { HowItWorksSection } from './how-it-works-section';
import { ProductsSection } from './products-section';

export const AffiliateBody = () => {
  return (
    <div className="mx-auto flex max-w-[40rem] flex-col gap-16">
      <section>
        <div className="space-y-1.5">
          <H3>Refer your friends and earn $50</H3>
          <Body1 className="text-secondary">
            Share your unique referral link with friends and family. When they
            sign up, you&apos;ll each receive $50 to spend at Superpower on
            health products, supplements and more.
          </Body1>
        </div>
        <AffiliateLink className="mt-6" />
      </section>
      <HowItWorksSection />
      <ProductsSection />
      <FAQSection />
    </div>
  );
};
