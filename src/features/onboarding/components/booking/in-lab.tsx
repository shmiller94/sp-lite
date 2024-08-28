import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useStepper } from '@/components/ui/stepper';
import { Body1, Body2, H2, H3, H4 } from '@/components/ui/typography';
import { useGetServiceability } from '@/features/onboarding/api/get-serviceability';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { cn } from '@/lib/utils';
import { AddressInput } from '@/shared/api/update-profile';

const InLabServiceCard = () => {
  return (
    <div className="space-y-3 rounded-2xl border border-zinc-200 p-6">
      <H3 className="text-zinc-700">In person lab</H3>
      <div className="space-y-2">
        <Body1 className="text-zinc-500">
          Perform testing at a partner clinic.
        </Body1>
      </div>
    </div>
  );
};

export const InLab = () => {
  const { prevStep, nextStep } = useStepper((s) => s);
  const getServiceabilityMutation = useGetServiceability();
  const { address, updateAddress, isBlocked, updateBlocked } = useOnboarding(
    (s) => s,
  );

  const submitZip = async () => {
    if (zipCode.length === 5) {
      const { serviceable } = await getServiceabilityMutation.mutateAsync({
        data: { postalCode: zipCode },
      });

      if (!serviceable) {
        updateBlocked(true);
      } else {
        updateBlocked(false);
        updateAddress({ ...address, postalCode: zipCode } as AddressInput);
        nextStep();
      }
    }
  };

  const [zipCode, setZipCode] = useState(address?.postalCode ?? '');
  return (
    <section id="main" className="space-y-16">
      <div className="space-y-4">
        <H2 className="text-zinc-900">Service type</H2>
        <InLabServiceCard />
      </div>

      <div className="space-y-12">
        <div className="space-y-3">
          <H2 className="text-zinc-900">We will find a lab for you</H2>
          <H4 className="text-zinc-500">
            Please provide us your zip code, a concierge will be contacting you
            when a nearby testing lab is found.
          </H4>
        </div>
        <div className="space-y-2">
          <Body2 className="text-zinc-500">My zip code</Body2>
          <Input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className={cn(
              isBlocked &&
                'border border-[#B90090] bg-[#FFF3F6] focus-visible:bg-[#FFF3F6] focus-visible:ring-0',
            )}
          />
          {isBlocked && (
            <Body2 className="text-[#B90090]">
              Sorry, we’re unable to service your area right now. please go back
              and try a different address.
            </Body2>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={submitZip} disabled={zipCode.length !== 5}>
            {getServiceabilityMutation.isPending ? (
              <Spinner variant="light" className="size-6" />
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};
