import type { ReactNode } from 'react';
import { useState } from 'react';

import { AnimatedCheckbox } from '@/components/ui/checkbox';
import { Body1, Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { HealthcareService } from '@/types/api';
import { formatMoney } from '@/utils/format-money';
import { getServiceImage } from '@/utils/service';

// NOTE: details trigger should be used very carefully here
// if you render this card inside of the healthcaredialog it would crash
type ServiceSelectCardDetailsRenderOptions = {
  isExpanded: boolean;
  toggle: () => void;
};

type ServiceSelectCardDetailsRenderResult = {
  trigger?: ReactNode;
  content?: ReactNode;
};

type ServiceSelectCardProps = {
  service: HealthcareService;
  disabled: boolean;
  checked: boolean;
  toggle: (s: HealthcareService) => void;
  details?: (
    options: ServiceSelectCardDetailsRenderOptions,
  ) => ServiceSelectCardDetailsRenderResult | undefined;
};

export const ServiceSelectCard = ({
  service,
  disabled,
  checked,
  toggle,
  details,
}: ServiceSelectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded((prev) => !prev);
  };

  const detailsResult = details?.({
    isExpanded,
    toggle: toggleDetails,
  });

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[20px] border border-zinc-200 bg-white text-left transition',
        'hover:border-zinc-300',
        'flex flex-col',
        isExpanded && 'border-zinc-300',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="flex w-full items-center gap-4 p-4">
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
          {detailsResult?.trigger ? (
            <div className="mt-1">{detailsResult.trigger}</div>
          ) : null}
        </div>
        {service.price > 0 && !disabled && (
          <Body1 className="hidden md:block">
            {formatMoney(service.price)}
          </Body1>
        )}
      </div>

      {detailsResult?.content && isExpanded ? (
        <div className="ml-0 flex-1 border-t border-zinc-200 p-4 md:ml-32 md:mr-4 md:px-0">
          {detailsResult?.content}
        </div>
      ) : null}
    </div>
  );
};
