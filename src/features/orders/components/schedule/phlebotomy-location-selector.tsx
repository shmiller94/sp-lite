import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Body1, Body2 } from '@/components/ui/typography';
import { useCredits } from '@/features/orders/api/credits';
import { CurrentAddressEditSuggestion } from '@/features/users/components/current-address-card';
import { cn } from '@/lib/utils';
import { CollectionMethodType } from '@/types/api';
import { formatMoney } from '@/utils/format-money';

import { useCollectionMethods } from '../../hooks';
import { useScheduleStore } from '../../stores/schedule-store';

export const PhlebotomyLocationSelector = () => {
  const {
    collectionMethod,
    updateCollectionMethod,
    updateLocation,
    updateSlot,
    updateTz,
    selectedCreditIds,
  } = useScheduleStore((s) => s);

  const handleOptionClick = (optionValue: CollectionMethodType) => {
    updateCollectionMethod(
      collectionMethod === optionValue ? null : optionValue,
    );
    updateLocation(null);
    updateSlot(null);
    updateTz(null);
  };

  const creditIds: string[] = [];
  for (const creditId of selectedCreditIds) {
    creditIds.push(creditId);
  }

  const { options, isLoading, showMissingPrimaryAddress } =
    useCollectionMethods({
      creditIds,
    });
  const { data: creditsData } = useCredits();
  const hasAdvancedPanelSelected =
    creditsData?.credits.some(
      (credit) =>
        selectedCreditIds.has(credit.id) &&
        credit.serviceId.includes('advanced-blood-panel'),
    ) ?? false;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[92px] w-full rounded-2xl" variant="shimmer" />
        <Skeleton className="h-[92px] w-full rounded-2xl" variant="shimmer" />
      </div>
    );
  }

  return (
    <RadioGroup
      defaultValue={collectionMethod ?? 'AT_HOME'}
      className="flex flex-col"
    >
      {showMissingPrimaryAddress ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-zinc-500">No primary address found.</p>
          <CurrentAddressEditSuggestion />
        </div>
      ) : null}
      {options.map((option) => {
        const isDisabled =
          option.disabled ||
          (option.value === 'AT_HOME' && hasAdvancedPanelSelected);

        return (
          <div
            key={option.value}
            className={cn(
              'flex flex-1 space-x-4 rounded-2xl border bg-white px-4 py-5',
              collectionMethod === option.value
                ? 'border-vermillion-900 shadow-lg shadow-vermillion-900/10'
                : 'border-zinc-200 hover:bg-zinc-50',
              isDisabled ? 'opacity-50' : null,
            )}
            role="presentation"
            onClick={() =>
              isDisabled ? undefined : handleOptionClick(option.value)
            }
          >
            <RadioGroupItem
              value={option.value}
              checked={collectionMethod === option.value}
              disabled={isDisabled}
              variant="vermillion"
            />
            <Label htmlFor={option.value} className="w-full">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Body1>{option.name}</Body1>
                  <Body2 className="text-balance text-zinc-500 sm:text-base">
                    {option.description}
                  </Body2>
                </div>
                {option.price ? (
                  <Body1>+{formatMoney(option.price)}</Body1>
                ) : null}
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};
