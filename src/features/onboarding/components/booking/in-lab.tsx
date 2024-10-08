import { MapPin } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { Body1, Body2, Body3, H2, H3, H4 } from '@/components/ui/typography';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { usePhlebotomyLocations } from '@/features/orders/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useUser } from '@/lib/auth';
import { useStepper } from '@/lib/stepper';
import { cn } from '@/lib/utils';
import { PhlebotomyLocation } from '@/types/api';
import { formatAddress } from '@/utils/format';

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
  const { prevStep, nextOnboardingStep } = useStepper((s) => s);
  const serviceAddress = useOnboarding((s) => s.serviceAddress);
  const { data: user } = useUser();
  const [zipCode, setZipCode] = useState(
    user?.primaryAddress?.address?.postalCode ?? '',
  );
  const debouncedZipCode = useDebounce(zipCode, 500);

  const phlebotomyLocationsMutation = usePhlebotomyLocations({
    postalCode: debouncedZipCode,
    queryConfig: { enabled: debouncedZipCode.length === 5 },
  });

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
          <div className="flex flex-row items-center">
            <Body2 className="text-zinc-500">My zip code</Body2>
            {phlebotomyLocationsMutation.isLoading && (
              <span>
                <Spinner variant="primary" />
              </span>
            )}
          </div>
          <Input
            maxLength={5}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <LocationList
            locations={phlebotomyLocationsMutation.data?.locations || []}
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextOnboardingStep} disabled={!serviceAddress}>
            Continue
          </Button>
        </div>
      </div>
    </section>
  );
};

function LocationList({
  locations,
}: {
  locations: PhlebotomyLocation[];
}): JSX.Element {
  const { updateServiceAddress, serviceAddress } = useOnboarding();

  if (!locations || locations.length === 0) {
    return (
      <p className="text-zinc-500">
        No locations found. Please enter a new zip code.
      </p>
    );
  }

  return (
    <div className="max-h-[240px] overflow-y-scroll rounded-2xl border border-zinc-200 bg-white p-2">
      <RadioGroup
        className="flex flex-col"
        defaultValue={formatAddress(serviceAddress?.address)}
      >
        {locations?.map((option, index) => (
          <Label
            key={option.id}
            className={cn(
              'rounded-lg py-4 px-6 text-left transition-all hover:bg-accent flex cursor-pointer items-center gap-4',
              formatAddress(serviceAddress?.address) ===
                formatAddress(option.address)
                ? 'bg-accent'
                : null,
            )}
            onClick={async () => {
              updateServiceAddress({ address: option.address, id: nanoid() });
            }}
            htmlFor={`item-${index}`}
          >
            <div className="flex items-center gap-4">
              <RadioGroupItem
                value={formatAddress(option.address)}
                id={`item-${index}`}
              />
              <div className="flex flex-col items-start gap-1">
                <Body1 className="text-zinc-600">
                  {formatAddress(option.address)}
                </Body1>
                <div className="flex flex-row items-center gap-px">
                  <MapPin className="h-4 min-w-4 text-zinc-400" />
                  <Body3 className="text-zinc-400">
                    {option.name
                      ? `${option.name} ( ${option.distance} mile${option.distance > 1 ? 's' : ''} )`
                      : `${option.distance} mile${option.distance > 1 ? 's' : ''}`}
                  </Body3>
                </div>
              </div>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
