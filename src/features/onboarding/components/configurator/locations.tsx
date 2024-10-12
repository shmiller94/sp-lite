import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { OnboardingLocation } from '@/features/onboarding/types/location';
import { getLocations } from '@/features/onboarding/utils/get-locations';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/format-money';

interface LocationTestCardProps extends React.HTMLAttributes<HTMLDivElement> {
  location: OnboardingLocation;
  selected: boolean;
}

const LocationTestCard: React.FC<LocationTestCardProps> = ({
  location,
  selected,
  ...rest
}) => {
  return (
    <div
      {...rest}
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
                <div className="w-fit rounded-[6px] bg-vermillion-100 px-2 py-1 text-[11px] text-vermillion-900 xs:text-xs">
                  Recommended
                </div>
              )}
              {location.type === 'EVENT' && (
                <div className="w-fit rounded-[6px] bg-vermillion-100 px-2 py-1 text-[11px] text-vermillion-900 xs:text-xs">
                  Special
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
  const { collectionMethod, updateCollectionMethod } = useOnboarding();

  const locations = getLocations();

  return (
    <section id="location" className="w-full max-w-[500px] space-y-6">
      <div className="space-y-2">
        <H2 className="text-[#1E1E1E]">Select service location</H2>
      </div>
      <div className="space-y-2">
        <RadioGroup value={collectionMethod ?? 'IN_LAB'}>
          {locations.map((location, i) => (
            <LocationTestCard
              key={i}
              location={location}
              selected={collectionMethod === location.type}
              onClick={() => updateCollectionMethod(location.type)}
            />
          ))}
        </RadioGroup>
      </div>
    </section>
  );
};

export { SectionLocations };
