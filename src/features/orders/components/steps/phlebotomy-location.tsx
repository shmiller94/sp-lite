import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { Body1, Body2, Body3, H2 } from '@/components/ui/typography';
import {
  useGetServiceability,
  usePhlebotomyLocations,
} from '@/features/orders/api';
import { useOrder } from '@/features/orders/stores/order-store';
import { useDebounce } from '@/hooks/use-debounce';
import { useUser } from '@/lib/auth';
import { useStepper } from '@/lib/stepper';
import { cn } from '@/lib/utils';
import { PhlebotomyLocation } from '@/types/api';
import { formatAddress } from '@/utils/format';

import { CreateOrderPhlebotomyLocationSelector } from '../phlebotomy-location-selector';

export const PhlebotomyLocationSelect = () => {
  const { collectionMethod, location } = useOrder((s) => s);
  const { activeStep, nextStep, steps, prevStep } = useStepper((s) => s);

  return (
    <>
      <div className="p-6 md:p-14">
        <div className="space-y-16">
          <div className="space-y-4">
            <H2>Select a service type</H2>
            <CreateOrderPhlebotomyLocationSelector />
          </div>
          {collectionMethod === 'IN_LAB' ? (
            <CreateOrderPhlebotomyInLab />
          ) : null}
          {collectionMethod === 'AT_HOME' ||
          collectionMethod === 'PHLEBOTOMY_KIT' ? (
            <CreateOrderPhlebotomyAtHome />
          ) : null}
        </div>
      </div>
      <div className="flex items-center px-6 pb-12 md:justify-between md:px-14">
        <Body1 className="hidden text-zinc-400 md:block">
          Step {activeStep + 1} of {steps.length}
        </Body1>
        <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={!location}
            className="w-full md:w-auto"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

function CreateOrderPhlebotomyInLab(): JSX.Element {
  const { data: user } = useUser();
  const updateLocation = useOrder((s) => s.updateLocation);

  const [zipCode, setZipCode] = useState<string>(
    user?.primaryAddress?.address.postalCode ?? '',
  );
  const debouncedZipCode = useDebounce(zipCode, 500);
  const phlebotomyLocationsMutation = usePhlebotomyLocations({
    postalCode: debouncedZipCode,
    queryConfig: { enabled: debouncedZipCode.length === 5 },
  });

  useEffect(() => {
    if (zipCode.length !== 5) {
      updateLocation(null);
    }
  }, [zipCode]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <H2>Nearby Labs</H2>
        <Body1 className="text-zinc-500">
          Please enter your zip code and we will find a partner laboratory
          closest to you.
        </Body1>
      </div>
      <form className="space-y-2">
        <div className="flex items-center gap-1">
          <Body2 className="text-zinc-500">My zip code</Body2>
          {phlebotomyLocationsMutation.isLoading && (
            <span>
              <Spinner size="xs" variant="primary" />
            </span>
          )}
        </div>
        <Input
          maxLength={5}
          value={zipCode}
          placeholder="5-digit zip code"
          onChange={(e) => setZipCode(e.target.value)}
        />
      </form>
      <LocationList
        locations={phlebotomyLocationsMutation.data?.locations || []}
      />
    </div>
  );
}

function CreateOrderPhlebotomyAtHome(): JSX.Element {
  const { updateLocation, collectionMethod } = useOrder((s) => s);
  const { data: user } = useUser();

  const { data, mutateAsync, isPending } = useGetServiceability();
  const isServiceable = data?.serviceable;

  useEffect(() => {
    const checkServiceable = async (): Promise<void> => {
      if (user?.primaryAddress) {
        const { postalCode } = user.primaryAddress.address;

        const response = await mutateAsync({
          data: {
            zipCode: postalCode,
            collectionMethod: collectionMethod || 'AT_HOME',
          },
        });

        if (response.serviceable) {
          updateLocation({ address: user.primaryAddress.address });
        }
      }
    };

    checkServiceable();
  }, [collectionMethod]);

  if (!user?.primaryAddress) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <H2>Place of service</H2>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 px-8 py-6">
          <Body2 className="text-zinc-500">
            No primary address found, add one in settings.
          </Body2>
        </div>
      </div>
    );
  }

  const { line, city, postalCode, state } = user.primaryAddress.address;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <H2>Place of service</H2>
      </div>

      <div
        className={cn(
          'flex flex-col gap-3 rounded-2xl border border-zinc-200 px-8 py-6',
          !isPending && !isServiceable ? 'border-pink-700 bg-pink-50' : null,
        )}
      >
        <Body2
          className={cn(
            'text-zinc-500',
            !isPending && !isServiceable ? 'text-pink-700' : null,
          )}
        >
          My Address
        </Body2>
        <div>
          <Body1>
            {user?.firstName} {user?.lastName}
          </Body1>
          <Body1>{line.join(' ')}</Body1>
          <Body1>{city}</Body1>
          <Body1>
            {state} {postalCode}, US
          </Body1>
        </div>
      </div>

      {!isServiceable && !isPending ? (
        <Body2 className="text-pink-700">
          Sorry, we’re unable to service your area right now. please go back and
          try a different address.
        </Body2>
      ) : null}
    </div>
  );
}

function LocationList({
  locations,
}: {
  locations: PhlebotomyLocation[];
}): JSX.Element {
  const { location, updateLocation } = useOrder((s) => s);

  if (!locations || locations.length === 0) {
    return (
      <p className="text-zinc-500">
        No locations found. Please enter a new zip code.
      </p>
    );
  }

  return (
    <div className="max-h-[240px] overflow-y-scroll rounded-2xl border border-zinc-200 bg-white p-2">
      <RadioGroup className="flex flex-col">
        {locations?.map((option, index) => (
          <button
            key={index}
            className={cn(
              'rounded-lg py-4 px-6 text-left transition-all hover:bg-accent',
              formatAddress(location?.address) === formatAddress(option.address)
                ? 'bg-accent'
                : null,
            )}
            onClick={() => {
              updateLocation(option);
            }}
          >
            <Label
              htmlFor={`item-${index}`}
              className="flex cursor-pointer items-center gap-4 "
            >
              <RadioGroupItem
                value={formatAddress(option.address)}
                id={`item-${index}`}
              />
              <div className="flex flex-col items-start gap-1">
                <Body1 className="text-[#52525B]">
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
            </Label>
          </button>
        ))}
      </RadioGroup>
    </div>
  );
}
