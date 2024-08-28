import { Dot } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Body1, Body2 } from '@/components/ui/typography';
import {
  GRAIL_GALLERI_MULTI_CANCER_TEST,
  GUT_MICROBIOME_ANALYSIS,
  TOTAL_TOXIN_TEST,
} from '@/const';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { AddToCalendar } from '@/shared/components';
import { HealthcareService } from '@/types/api';

export const AdditionalServiceCard = ({
  service,
  onEdit,
}: {
  service: HealthcareService;
  onEdit?: () => void;
}) => {
  const { address, slots } = useOnboarding();

  const conditions = {
    [GRAIL_GALLERI_MULTI_CANCER_TEST]: slots.cancer,
    [GUT_MICROBIOME_ANALYSIS]: slots.microbiome,
    [TOTAL_TOXIN_TEST]: slots.toxin,
  };

  if (!conditions[service.name as keyof typeof conditions]) {
    return;
  }

  const renderInfo = () => {
    switch (service.name) {
      case GRAIL_GALLERI_MULTI_CANCER_TEST:
        return (
          <div className="flex items-center gap-1.5">
            <Body2 className="text-zinc-500">At home visit</Body2>
            <Dot className="text-zinc-500" />
            <Body2 className="text-zinc-500">
              {slots.cancer?.start ?? 'soon'}
            </Body2>
          </div>
        );
      case TOTAL_TOXIN_TEST:
      case GUT_MICROBIOME_ANALYSIS:
        return (
          <div className="flex items-center gap-1.5">
            <Body2 className="text-zinc-500">{`Ships to ${address?.line1} ${address?.line2}`}</Body2>
            <Dot className="text-zinc-500" />
            <Body2 className="text-zinc-500">
              Arriving in 2-3 business days
            </Body2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-4 rounded-xl border border-zinc-200 p-4">
      <img
        className="size-[56px] rounded-lg object-cover"
        src={service.image}
        alt="service"
      />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1.5">
            <Body1 className="text-zinc-900">{service.name}</Body1>
            {onEdit && (
              <div className="flex items-center gap-1.5">
                <Dot className="text-zinc-500" />
                <Button
                  variant="ghost"
                  className="p-0 text-sm text-zinc-500"
                  onClick={onEdit}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          <Body2 className="line-clamp-1 text-zinc-500">{renderInfo()}</Body2>
        </div>
        {!onEdit &&
          service.name === GRAIL_GALLERI_MULTI_CANCER_TEST &&
          address &&
          slots.cancer && (
            <AddToCalendar
              service={service.name}
              address={address}
              slot={slots.cancer}
              collectionMethod="AT_HOME"
            />
          )}
      </div>
    </div>
  );
};
