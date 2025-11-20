import React, { useCallback, useMemo } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Body1 } from '@/components/ui/typography';
import {
  ADVANCED_BLOOD_PANEL,
  MAX_TUBE_COUNT,
  SUPERPOWER_BLOOD_PANEL,
} from '@/const';
import {
  EstimatedTooltip,
  PanelInfoCard,
} from '@/features/orders/components/steps/panels';
import { useServices } from '@/features/services/api';
import { cn } from '@/lib/utils';
import { HealthcareService } from '@/types/api';
import { formatMoney } from '@/utils/format-money';

import { useAddOnPanelStore } from '../../stores/add-on-panel-store';

type AddOnsProps = {
  existingCreditIds?: Set<string>;
  className?: string;
  isLoading?: boolean;
};

// if anyone touches that or makes this logic worse u are dead man
export const AddOnPanelsSelect = ({
  existingCreditIds,
  className,
  isLoading = false,
}: AddOnsProps) => {
  const { selectedPanelIds, togglePanel } = useAddOnPanelStore();
  const addOnServicesQuery = useServices({ group: 'blood-panel-addon' });
  const visibleServices = addOnServicesQuery.data?.services ?? [];

  const ownedIds = useMemo(
    () => existingCreditIds ?? new Set<string>(),
    [existingCreditIds],
  );

  const hasBaselineCredit = useMemo(() => {
    for (const id of ownedIds) {
      if (id.toLowerCase().includes('baseline')) return true;
    }
    return false;
  }, [ownedIds]);

  const hasAdvancedCredit = useMemo(() => {
    for (const id of ownedIds) {
      if (id.toLowerCase().includes('advanced')) return true;
    }
    return false;
  }, [ownedIds]);

  // filter out excluded services from list of add-on services and apply sorting logic
  const services = useMemo(() => {
    return visibleServices.filter((s) => {
      if (![SUPERPOWER_BLOOD_PANEL, ADVANCED_BLOOD_PANEL].includes(s.name))
        return true;

      if (s.name === SUPERPOWER_BLOOD_PANEL) return hasBaselineCredit;
      if (s.name === ADVANCED_BLOOD_PANEL) return hasAdvancedCredit;

      return false;
    });
  }, [visibleServices, hasBaselineCredit, hasAdvancedCredit]);

  const tubeCountById = useMemo(
    () => new Map(services.map((s) => [s.id, s.bloodTubeCount ?? 0])),
    [services],
  );

  const baseTubes = useMemo(() => {
    let sum = 0;
    ownedIds.forEach((id) => {
      sum += tubeCountById.get(id) ?? 0;
    });
    return sum;
  }, [ownedIds, tubeCountById]);

  const totalTubes = useMemo(() => {
    let sum = baseTubes;
    selectedPanelIds.forEach((id) => {
      if (!ownedIds.has(id)) sum += tubeCountById.get(id) ?? 0;
    });
    return sum;
  }, [baseTubes, selectedPanelIds, ownedIds, tubeCountById]);

  const toggle = useCallback(
    (service: HealthcareService) => {
      if (ownedIds.has(service.id)) return; // already purchased: immutable

      // If already selected, just remove it
      if (selectedPanelIds.has(service.id)) {
        togglePanel(service.id);
        return;
      }

      // recompute current total (excluding owned)
      let currentTotal = baseTubes;
      selectedPanelIds.forEach((id) => {
        if (!ownedIds.has(id)) currentTotal += tubeCountById.get(id) ?? 0;
      });

      const addCount = service.bloodTubeCount ?? 0;
      if (currentTotal + addCount > MAX_TUBE_COUNT) return; // reject add

      // Only toggle if validation passes
      togglePanel(service.id);
    },
    [togglePanel, baseTubes, ownedIds, tubeCountById, selectedPanelIds],
  );

  const totalPrice = useMemo(
    () =>
      services
        .filter((s) => selectedPanelIds.has(s.id) && !ownedIds.has(s.id))
        .reduce((sum, s) => sum + s.price, 0),
    [services, selectedPanelIds, ownedIds],
  );

  return (
    <>
      <div className={cn('space-y-2', className)}>
        {addOnServicesQuery.isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-[106px] w-full rounded-[20px]" key={i} />
          ))}

        {!addOnServicesQuery.isLoading &&
          services.map((s) => {
            const isPurchased = ownedIds.has(s.id);
            const checked = isPurchased || selectedPanelIds.has(s.id);

            const wouldExceed =
              !isPurchased &&
              !selectedPanelIds.has(s.id) &&
              totalTubes + (s.bloodTubeCount ?? 0) > MAX_TUBE_COUNT;

            const disabled = isPurchased || wouldExceed || isLoading;

            return (
              <PanelInfoCard
                key={s.id}
                disabled={disabled}
                checked={checked}
                toggle={toggle}
                s={s}
              />
            );
          })}
      </div>

      <div className="mt-4 flex justify-between ">
        {addOnServicesQuery.isLoading ? (
          <Skeleton className="h-6 w-full" />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Body1 className="text-secondary">
                Estimated Total: {totalTubes}/{MAX_TUBE_COUNT} additional tubes
              </Body1>
              <EstimatedTooltip />
            </div>
            <Body1>{formatMoney(totalPrice)}</Body1>
          </>
        )}
      </div>
    </>
  );
};
