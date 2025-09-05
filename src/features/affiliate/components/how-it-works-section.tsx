import {
  DollarSignIcon,
  MailIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react';

import { IconList, IconListItem } from '@/components/shared/icon-list';
import { H3 } from '@/components/ui/typography';

const steps: IconListItem[] = [
  {
    title: 'Share your unique link',
    description:
      'Invite your friends to join Superpower using your unique referral link',
    icon: MailIcon,
  },
  {
    title: 'Give $50 to your friends',
    description:
      'When your friends join Superpower, they get $50 to spend in the Marketplace.',
    icon: DollarSignIcon,
  },
  {
    title: 'Earn $50 in credit',
    description:
      "You'll also receive $50 for every friend who signs up with your link.",
    icon: UserIcon,
  },
  {
    title: 'Redeem your credits',
    description:
      'Use your credits in the Superpower Marketplace on health products, supplements, and more.',
    icon: ShoppingBagIcon,
  },
];

export const HowItWorksSection = () => {
  return (
    <section>
      <H3>How it works</H3>
      <div className="mt-6">
        <IconList items={steps} />
      </div>
    </section>
  );
};
