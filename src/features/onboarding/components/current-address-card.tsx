import React from 'react';

import { Body1, Body2 } from '@/components/ui/typography';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { useUser } from '@/lib/auth';

export const CurrentAddressCard = () => {
  const { data } = useUser();
  const { address } = useOnboarding();

  return (
    <div className="w-full space-y-3 rounded-2xl border border-zinc-200 px-8 py-6">
      <Body2 className="text-zinc-400">Current Address</Body2>

      <div>
        <Body1 className="text-zinc-700">
          {data?.firstName} {data?.lastName}
        </Body1>
        <Body1 className="text-zinc-700">{address?.line1}</Body1>
        <Body1 className="text-zinc-700">{address?.city}</Body1>
        <Body1 className="text-zinc-700">
          {address?.state} {address?.postalCode}, US
        </Body1>
      </div>
    </div>
  );
};
