import { Body1, H3 } from '@/components/ui/typography';

import { CardInfo } from '../baseline-summary';

export const PurchaseMembershipInfoSection = () => {
  return (
    <div className="space-y-3">
      <H3 className="text-primary">Purchase Membership</H3>
      <Body1 className="text-zinc-500">
        Your membership auto-renews each year. Cancel anytime.
        <br />
        To use your HSA/FSA card and get reimbursed, please email{' '}
        <a href="mailto:concierge@superpower.com">
          concierge@superpower.com
        </a>{' '}
        after checking out and our team will help you submit!
      </Body1>
      <CardInfo className="lg:hidden" />
    </div>
  );
};
