import { ChevronLeft } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { AtHomeNoticeSection } from '@/components/shared/at-home-notice-section';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Body1, Body2 } from '@/components/ui/typography';
import { useCheckoutContext } from '@/features/auth/stores';
import { RegisterInput } from '@/lib/auth';

import { AtHomeDrawCreditSection } from './baseline-summary';
import {
  BillingSection,
  YourDetailsSection,
  PurchaseMembershipInfoSection,
} from './sections';

const ConfiguratorSections = ({ onPrev }: { onPrev: () => void }) => {
  const processing = useCheckoutContext((s) => s.processing);
  const form = useFormContext<RegisterInput>();
  const postalCode = form.watch('postalCode');

  const CONFIGURATOR_ITEMS = [
    {
      component: (
        <AtHomeNoticeSection postalCode={postalCode} className="lg:hidden" />
      ),
    },
    {
      component: <PurchaseMembershipInfoSection />,
    },
    {
      component: <AtHomeDrawCreditSection className="lg:hidden" />,
    },
    {
      component: <YourDetailsSection />,
    },
    {
      component: <BillingSection />,
    },
  ];

  const visibleItems = CONFIGURATOR_ITEMS.filter((item) => item.component);

  return (
    <div className="relative mx-auto flex size-full flex-col items-center gap-6 px-4 md:px-8 lg:max-w-2xl">
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <SuperpowerLogo />
          <div className="flex items-center gap-4">
            <Body2 className="text-zinc-400">
              Step {2} / {2}
            </Body2>
            <Progress value={100} className="h-[3px] w-20" />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          className="mr-auto"
          disabled={processing}
        >
          <ChevronLeft size={14} className="text-zinc-500" />
          <Body2 className="text-zinc-500">Email</Body2>
        </Button>
      </div>
      <div className="flex flex-1 flex-col justify-center space-y-6">
        {visibleItems.map((item, index) => {
          return (
            <div
              key={index}
              // idea here with [&:empty]:hidden is some components return null and we want to hide them
              className="flex flex-col justify-center [&:empty]:hidden"
            >
              {item.component}
            </div>
          );
        })}
      </div>

      {processing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-black/50 p-6 backdrop-blur-sm sm:flex-row">
          <Spinner variant="light" size="sm" />
          <Body1 className="text-center text-white">
            Processing payment. Do not refresh this tab.
          </Body1>
        </div>
      )}
    </div>
  );
};

export { ConfiguratorSections };
