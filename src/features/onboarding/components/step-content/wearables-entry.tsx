import { useVitalLink } from '@tryvital/vital-link';
import { ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';
import { Body1, H1 } from '@/components/ui/typography';
import { env } from '@/config/env';
import { useVitalToken } from '@/features/onboarding/api/get-vital-token';
import { EntryLayout } from '@/features/onboarding/components/layouts';

export const WearablesEntry = () => {
  const { data, refetch } = useVitalToken({});
  const { nextStep } = useStepper((s) => s);

  const [isLoading, setLoading] = useState(false);

  const onSuccess = useCallback(
    (_metadata: unknown) => {
      // Device is now connected.
      // TODO: If we don't receive webhooks in the short term
      // and use them to allow retrieval and disconnect of
      // devices.
      // Then, we need to use this as a temporary hack.
      console.log(_metadata);

      nextStep();
    },
    [nextStep],
  );

  const onExit = useCallback(
    (_metadata: unknown) => {
      // User has quit the link flow.
      console.log(_metadata);
      refetch();
    },
    [refetch],
  );

  const onError = useCallback(
    (_metadata: unknown) => {
      // Error encountered in connecting device.
      console.log(_metadata);
      refetch();
    },
    [refetch],
  );

  const config = {
    onSuccess,
    onExit,
    onError,
    env: env.VITAL_ENV || 'sandbox',
  };

  const { open, ready } = useVitalLink(config);

  const handleVitalOpen = async () => {
    setLoading(true);
    open(data?.linkToken);
    setLoading(false);
  };

  return (
    <section
      id="main"
      className="mx-auto flex max-w-[568px] flex-col gap-y-6 text-center"
    >
      <div className="space-y-2">
        <H1 className="text-white">Connect your wearable devices</H1>
        <Body1 className="text-white">
          + hundreds of additional data integrations
        </Body1>
      </div>
      <Button
        className="mx-auto flex flex-row items-center justify-center gap-1 rounded-[50px] bg-white p-4 text-zinc-900 hover:bg-white/90"
        onClick={handleVitalOpen}
        disabled={isLoading || !ready}
      >
        Connect
        <ChevronRight className="size-4" />
      </Button>
      <Body1
        className="cursor-pointer text-white hover:text-white/90"
        onClick={nextStep}
      >
        Skip and connect later
      </Body1>
    </section>
  );
};

export const WearablesEntryStep = () => (
  <EntryLayout title="Wearables" type="empty" className="bg-watch">
    <WearablesEntry />
  </EntryLayout>
);
