import { ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, Body2, Body3 } from '@/components/ui/typography';
import { useOrder } from '@/features/orders/stores/order-store';
import { formatDistanceText } from '@/features/orders/utils/format-distance-text';
import { getNormalizedText } from '@/features/orders/utils/get-normallized-text';
import { cn } from '@/lib/utils';
import { PhlebotomyLocation } from '@/types/api';
import { isIOS } from '@/utils/browser-detection';
import { formatAddress, toTitleCase } from '@/utils/format';

import { openInMaps } from '../utils/open-in-maps';

export const LocationList = ({
  locations,
  isLoading,
}: {
  locations?: PhlebotomyLocation[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1">
        <div className="h-[320px] overflow-y-auto">
          <LocationListSkeleton />
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1">
        <div className="flex h-[320px] items-center justify-center">
          <Body2 className="text-zinc-500">
            Available locations will appear here
          </Body2>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1">
      <div className="h-[320px] overflow-y-auto scrollbar scrollbar-thumb-zinc-300 [overflow:overlay] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-2">
        <LocationListOptions locations={locations} />
      </div>
    </div>
  );
};

const LocationListOptions = ({
  locations,
}: {
  locations: PhlebotomyLocation[];
}) => {
  const { location } = useOrder((s) => s);

  return (
    <RadioGroup
      className="flex h-full flex-col gap-2 p-1"
      defaultValue={formatAddress(location?.address)}
    >
      {locations.map((option, index) => (
        <LocationListOption
          key={index}
          option={option}
          index={index}
          isSelected={
            formatAddress(location?.address) === formatAddress(option.address)
          }
        />
      ))}
    </RadioGroup>
  );
};

const LocationListOption = ({
  option,
  index,
  isSelected,
}: {
  option: PhlebotomyLocation;
  index: number;
  isSelected: boolean;
}) => {
  const updateLocation = useOrder((s) => s.updateLocation);
  const streetAddress = option.address.line
    .map((line) => getNormalizedText(line))
    .join(', ');
  const city = getNormalizedText(option.address.city);
  const distanceText = formatDistanceText(option.distance);

  const locationName = `${toTitleCase(option.name)}, ${streetAddress}`;
  const locationDetails = `${city}, ${option.address.state}, ${option.address.postalCode} · ${distanceText}`;

  const handleOpenMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mapType = isIOS() ? 'apple' : 'google';
    openInMaps(option, mapType);
  };

  return (
    <Label
      className={cn(
        'rounded-lg p-4 text-left transition-all hover:bg-accent flex cursor-pointer items-center gap-4',
        isSelected ? 'bg-accent' : null,
      )}
      onClick={() => updateLocation(option)}
      htmlFor={`item-${index}`}
    >
      <RadioGroupItem
        value={formatAddress(option.address)}
        id={`item-${index}`}
      />
      <div className="flex grow flex-col items-start gap-1">
        <Body1 className="text-zinc-600">{locationName}</Body1>
        <Body3 className="text-zinc-400">{locationDetails}</Body3>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="hidden items-center gap-2 rounded-full px-2 py-1 sm:flex"
        onClick={handleOpenMaps}
      >
        <span className="cursor-pointer text-zinc-600 hover:underline">
          See location
        </span>
        <ExternalLink className="size-4 text-zinc-400" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="size-10 rounded-full hover:bg-zinc-200/50 sm:hidden"
        onClick={handleOpenMaps}
      >
        <ExternalLink className="size-5 text-zinc-400" />
      </Button>
    </Label>
  );
};

const LocationListSkeleton = () => {
  return (
    <div className="flex h-full flex-col gap-2 p-2">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="flex items-center rounded-lg p-4">
            <div className="flex w-full items-center gap-4">
              <Skeleton className="size-5 shrink-0 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
