import { H3 } from '@/components/ui/typography';

import {
  VisaIcon,
  AmericanExpressIcon,
  MasterCardIcon,
  HSAFSAIcon,
} from '../icons';

const AVAILABLE_PAYMENT_METHODS = [
  { icon: <AmericanExpressIcon /> },
  { icon: <VisaIcon /> },
  { icon: <MasterCardIcon /> },
  { icon: <HSAFSAIcon /> },
];

export const PaymentDetails = () => {
  return (
    <div className="mb-6 flex flex-row justify-between gap-2 md:mb-0 md:gap-4">
      <H3 className="text-zinc-900">Card</H3>
      <div className="flex gap-2">
        {AVAILABLE_PAYMENT_METHODS.map((pm) => pm.icon)}
      </div>
    </div>
  );
};
