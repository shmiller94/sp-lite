import { Info } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

import { SelectableCard } from '@/components/shared/selectable-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Body1, H2 } from '@/components/ui/typography';
import { MAX_TUBE_COUNT } from '@/const';
import { SHARED_CONTAINER_STYLE } from '@/features/orders/const/config';
import { useServices } from '@/features/services/api';
import { cn } from '@/lib/utils';
import { Credit } from '@/types/api';
import { getServiceImage } from '@/utils/service';

import { useCredits } from '../../../api/credits';
import { useScheduleStore } from '../../../stores/schedule-store';
import { ScheduleFlowFooter } from '../schedule-flow-footer';

export const CreditsSelectStep = () => {
  const { selectedCreditIds, updateSelectedCreditIds } = useScheduleStore(
    (s) => s,
  );

  const isDisabled = [...selectedCreditIds].length === 0;

  return (
    <>
      <div className={cn('space-y-8', SHARED_CONTAINER_STYLE)}>
        <div className="space-y-2">
          <H2>Schedule your tests</H2>
          <Body1 className="text-zinc-500">
            For your health and safety, each visit is limited to a combined
            total of 14 vials (Vial is small blood sample tube). If you want to
            test more, please book another appointment.
          </Body1>
        </div>
        <CreditsSelectContent
          selectedIds={selectedCreditIds}
          setSelectedIds={updateSelectedCreditIds}
        />
      </div>
      <ScheduleFlowFooter nextBtnDisabled={isDisabled} />
    </>
  );
};

type CreditsSelectContentProps = {
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  className?: string;
  isLoading?: boolean;
};

const CreditsSelectContent = ({
  selectedIds,
  setSelectedIds,
  className,
  isLoading = false,
}: CreditsSelectContentProps) => {
  const mode = useScheduleStore((s) => s.mode);
  const servicesQuery = useServices({ group: mode });
  const creditsQuery = useCredits();

  const isQueryLoading = servicesQuery.isLoading || creditsQuery.isLoading;

  const services = servicesQuery.data?.services ?? [];
  const credits = creditsQuery.data?.credits ?? [];

  const uniqueCredits = useMemo(() => {
    const seen = new Set<string>();

    return credits.filter((credit) => {
      if (seen.has(credit.serviceId)) {
        return false;
      }
      seen.add(credit.serviceId);
      return true;
    });
  }, [credits]);

  const tubeCountByServiceId = useMemo(
    () => new Map(services.map((s) => [s.id, s.bloodTubeCount ?? 0])),
    [services],
  );

  const totalTubes = useMemo(() => {
    let sum = 0;

    selectedIds.forEach((creditId) => {
      const credit = uniqueCredits.find((c) => c.id === creditId);
      if (!credit) return;

      const tubeCount = tubeCountByServiceId.get(credit.serviceId) ?? 0;
      sum += tubeCount;
    });

    return sum;
  }, [selectedIds, uniqueCredits, tubeCountByServiceId]);

  const toggle = useCallback(
    (credit: Credit) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);

        if (next.has(credit.id)) {
          next.delete(credit.id);
          return next;
        }

        const serviceTubeCount =
          tubeCountByServiceId.get(credit.serviceId) ?? 0;

        // current total tubes from already selected credits
        let currentTotal = 0;
        prev.forEach((selectedCreditId) => {
          const selectedCredit = uniqueCredits.find(
            (c) => c.id === selectedCreditId,
          );
          if (!selectedCredit) return;
          currentTotal +=
            tubeCountByServiceId.get(selectedCredit.serviceId) ?? 0;
        });

        if (currentTotal + serviceTubeCount > MAX_TUBE_COUNT) {
          // reject add
          return prev;
        }

        next.add(credit.id);
        return next;
      });
    },
    [setSelectedIds, uniqueCredits, tubeCountByServiceId],
  );

  return (
    <>
      <div className={cn('space-y-2', className)}>
        {isQueryLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-[106px] w-full rounded-[20px]" key={i} />
          ))}

        {!isQueryLoading &&
          uniqueCredits.map((credit) => {
            const service = services.find((s) => s.id === credit.serviceId);
            if (!service) return;

            const checked = selectedIds.has(credit.id);

            const wouldExceed =
              !selectedIds.has(credit.id) &&
              totalTubes + (service.bloodTubeCount ?? 0) > MAX_TUBE_COUNT;

            const disabled = wouldExceed || isLoading;

            return (
              <SelectableCard
                key={credit.id}
                disabled={disabled}
                checked={checked}
                onToggle={() => toggle(credit)}
                title={service.name}
                imageSrc={getServiceImage(service.name)}
                description={
                  mode === 'phlebotomy'
                    ? `${service.bloodTubeCount} vials`
                    : service.description
                }
              />
            );
          })}
      </div>

      {mode === 'phlebotomy' ? (
        <div className="mt-4 flex justify-between ">
          {isQueryLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Body1 className="text-secondary">
                  Estimated Total: {totalTubes}/{MAX_TUBE_COUNT} additional
                  tubes
                </Body1>
                <EstimatedTooltip />
              </div>
            </>
          )}
        </div>
      ) : null}
    </>
  );
};

export const EstimatedTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={75}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="size-5 cursor-help touch-manipulation select-none text-zinc-400 transition-all hover:text-zinc-600 active:text-zinc-600"
            aria-label="Show citation details"
          >
            <Info className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs"
          collisionPadding={{
            right: 8,
            left: 8,
            top: 8,
            bottom: 8,
          }}
        >
          <p>
            For your comfort and safety, we limit each draw to 14 tubes. This
            ensures we collect enough blood to run all your tests without taking
            more than your body can easily replenish in a single visit. If
            you&apos;d like to add even more tests, you can visit the Services
            page in your dashboard and schedule another appointment.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
