import React, { ReactNode } from 'react';

import { AnimatedCheckbox } from '@/components/ui/checkbox';
import { Body1, Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { HealthcareService } from '@/types/api';
import { formatMoney } from '@/utils/format-money';
import { getServiceImage } from '@/utils/service';

// NOTE: learn more should be used very carefully here
// if you render this card inside of the healthcaredialog it would crash
export const ServiceSelectCard = ({
  service,
  disabled,
  checked,
  toggle,
  learnMore,
}: {
  service: HealthcareService;
  disabled: boolean;
  checked: boolean;
  toggle: (s: HealthcareService) => void;
  learnMore?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-4 rounded-[20px] border border-zinc-200 bg-white p-4 text-left hover:border-zinc-300',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <AnimatedCheckbox
        className="size-5 border"
        checked={checked}
        disabled={disabled}
        onClick={() => {
          if (!disabled) toggle(service);
        }}
      />
      <img
        src={getServiceImage(service.name)}
        className="size-16 object-cover"
        alt={service.name}
      />
      <div className="flex flex-1 flex-col items-start">
        <Body1 className="flex items-center gap-2">{service.name}</Body1>
        {service.price > 0 && !disabled && (
          <Body1 className="md:hidden">{formatMoney(service.price)}</Body1>
        )}
        {service.description && (
          <Body2 className="line-clamp-2 text-secondary">
            {service.description}
          </Body2>
        )}
        {learnMore}
      </div>
      {service.price > 0 && !disabled && (
        <Body1 className="hidden md:block">{formatMoney(service.price)}</Body1>
      )}
    </div>
  );
};
