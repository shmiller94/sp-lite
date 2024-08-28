import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import {
  GRAIL_GALLERI_MULTI_CANCER_TEST,
  GUT_MICROBIOME_ANALYSIS,
  TOTAL_TOXIN_TEST,
} from '@/const';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { useServices } from '@/features/services/api/get-services';
import { cn } from '@/lib/utils';
import { HealthcareService } from '@/types/api';
import { formatMoney } from '@/utils/format-money';

import { HealthcareCardDialog } from './healthcare-card-dialog';

type AdditionalServiceCardProps = {
  service: HealthcareService;
};

const AdditionalServiceCard = ({ service }: AdditionalServiceCardProps) => {
  const {
    addAdditionalService,
    removeAdditionalService,
    additionalServices,
    increaseOrderTotal,
    decreaseOrderTotal,
  } = useOnboarding();

  const checked = additionalServices.find((as) => as.id === service.id);
  return (
    <div
      className={cn(
        'flex items-center rounded-xl border border-zinc-200 py-5 px-6 hover:bg-zinc-50 cursor-pointer',
        checked ? 'bg-zinc-50' : '',
      )}
      role="presentation"
    >
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="flex max-w-[300px] flex-row gap-x-4">
          <div className="flex h-16 min-w-16 items-center justify-center rounded-lg bg-zinc-100">
            <img
              src={service.image}
              alt={service.name}
              className="size-10 object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Body1 className="line-clamp-1 text-zinc-500">{service.name}</Body1>
            <Body2 className="line-clamp-2 text-[#A5A5AE]">
              {service.description}
            </Body2>
            <HealthcareCardDialog healthcareService={service} />
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-2 sm:gap-x-6">
          <Body2 className="text-nowrap text-zinc-500">
            + {formatMoney(service.price)}
          </Body2>

          <Checkbox
            checked={!!checked}
            onCheckedChange={(checked) => {
              /* This is probably not the best way to keep track of this
               *
               * Potential TODO here is to refactor this so we dynamically make API calls one time
               * based on selected items in summary
               * */

              if (checked) {
                increaseOrderTotal(service.price);
                return addAdditionalService(service);
              }

              decreaseOrderTotal(service.price);
              return removeAdditionalService(service.id);
            }}
            className="size-5 border-zinc-200"
          />
        </div>
      </div>
    </div>
  );
};

const SectionServices = () => {
  const servicesQuery = useServices({});

  let services = servicesQuery.data;

  services = services?.filter(
    (service) =>
      service.name === GRAIL_GALLERI_MULTI_CANCER_TEST ||
      service.name === GUT_MICROBIOME_ANALYSIS ||
      service.name === TOTAL_TOXIN_TEST,
  );

  return (
    <section id="services" className="w-full max-w-[500px] space-y-8">
      <div className="space-y-2">
        <H2 className="text-[#1E1E1E]">Additional services</H2>
        <p className="text-base text-zinc-500">
          Your private health concierge will help you schedule them.
        </p>
      </div>
      <div className="space-y-2">
        {services?.map((service, i) => (
          <AdditionalServiceCard service={service} key={i} />
        ))}
      </div>
    </section>
  );
};

export { SectionServices };
