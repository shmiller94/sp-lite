import React from 'react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import {
  CollectionMethodType,
  useOnboarding,
} from '@/features/onboarding/stores/onboarding-store';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/format-money';

type Location = {
  displayName: string;
  description: string;
  price: number;
  type: CollectionMethodType;
};

const locations: Location[] = [
  {
    displayName: 'In-person lab',
    description: 'Get testing at a partner clinic.',
    price: 0,
    type: 'IN_LAB',
  },
  {
    displayName: 'At-home visit',
    description: 'Stress-free at your home or office.',
    price: 7900,
    type: 'AT_HOME',
  },
];

const LocationTestCard = ({
  location,
  selected,
}: {
  location: Location;
  selected: boolean;
}) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center rounded-xl border border-zinc-200 p-4 sm:px-6 sm:py-5',
        selected ? 'bg-zinc-50' : null,
      )}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="flex flex-row gap-x-4">
          <div>
            <div className="flex gap-1.5">
              <Body1 className="text-zinc-900">{location.displayName}</Body1>
              {location.type === 'AT_HOME' && (
                <div className="w-fit rounded-[6px] bg-[#FFEDD5] px-2 py-1 text-[11px] text-[#FC5F2B] xs:text-xs">
                  Recommended
                </div>
              )}
            </div>

            <Body2 className="text-zinc-500">{location.description}</Body2>
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-2 sm:gap-x-6">
          <Body2 className="text-zinc-500">
            {location.price === 0
              ? 'Included'
              : `+${formatMoney(location.price)}`}
          </Body2>

          <RadioGroupItem value={location.type} />
        </div>
      </div>
    </div>
  );
};

const SectionLocations = () => {
  const {
    collectionMethod,
    updateCollectionMethod,
    increaseOrderTotal,
    decreaseOrderTotal,
  } = useOnboarding();
  return (
    <section id="location" className="w-full max-w-[500px] space-y-6">
      <div className="space-y-2">
        <H2 className="text-[#1E1E1E]">Select service location</H2>
      </div>
      <div className="space-y-2">
        <RadioGroup
          onValueChange={(value: CollectionMethodType) => {
            value === 'AT_HOME'
              ? increaseOrderTotal(9900)
              : decreaseOrderTotal(9900);
            updateCollectionMethod(value);
          }}
          defaultValue={collectionMethod ?? 'IN_LAB'}
        >
          {locations.map((location, i) => (
            <LocationTestCard
              key={i}
              location={location}
              selected={collectionMethod === location.type}
            />
          ))}
        </RadioGroup>
      </div>
    </section>
  );
};

export { SectionLocations };
