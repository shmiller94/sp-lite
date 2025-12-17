import { useMemo } from 'react';

import { SuperpowerLogo } from '@/components/icons/superpower-logo';
import { SplitScreenLayout } from '@/components/layouts/split-screen-layout';
import { Body1, H2 } from '@/components/ui/typography';
import { useCreateCredit, useCredits } from '@/features/orders/api/credits';
import * as Payment from '@/features/users/components/payment';

import { useAddOnPanelStore } from '../../../stores/add-on-panel-store';
import { useOnboardingStepper } from '../onboarding-stepper';

import { AddOnPanelsSelect } from './panels';

const AddOnPanelsContent = () => {
  const { next } = useOnboardingStepper();
  const { selectedPanelIds, togglePanel } = useAddOnPanelStore();

  const creditsQuery = useCredits();
  const credits = creditsQuery.data?.credits ?? [];

  const existingCreditIds = useMemo(() => {
    const ids = new Set<string>();

    credits.map((c) => {
      ids.add(c.serviceId);
    });

    return ids;
  }, [credits]);

  const createCreditMutation = useCreateCredit();

  const upgradeOrder = async (paymentMethodId: string) => {
    await createCreditMutation.mutateAsync({
      data: {
        serviceIds: [...selectedPanelIds],
        paymentMethodId,
      },
    });
    next();
  };

  return (
    <>
      <div className="hidden w-full flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-10 lg:sticky lg:top-8 lg:flex lg:h-[calc(100svh-4rem)] lg:max-h-[calc(100svh-4rem)] lg:overflow-auto">
        <Body1 className="text-zinc-500">Add-on lab tests</Body1>
        <AddOnPanelsSelect
          selectedIds={selectedPanelIds}
          toggleSelectedId={togglePanel}
          existingCreditIds={existingCreditIds}
          isLoading={createCreditMutation.isPending}
          className="max-h-fit flex-1 overflow-y-scroll"
        />
      </div>
      <div className="w-full space-y-8 p-4 md:p-10">
        <div className="flex justify-start md:justify-end">
          <SuperpowerLogo />
        </div>
        <div className="space-y-2">
          <H2>Build your health foundation</H2>
          <Body1 className="text-zinc-500">
            Your Baseline test includes 100+ biomarkers across key areas of
            health. Add specialty tests to uncover deeper, evidence-based
            insights tailored to your personal goals.
          </Body1>
        </div>
        <div className="lg:hidden">
          <Body1 className="text-zinc-500">Add-on lab tests</Body1>
          <AddOnPanelsSelect
            selectedIds={selectedPanelIds}
            toggleSelectedId={togglePanel}
            existingCreditIds={existingCreditIds}
            isLoading={createCreditMutation.isPending}
            className="max-h-fit flex-1 overflow-y-scroll"
          />
        </div>
        <Payment.PaymentGroup>
          <Payment.PaymentDetails />
          <Payment.CurrentPaymentMethodCard className="!bg-white" />
          <Payment.SubmitPayment
            onSubmit={upgradeOrder}
            onCancel={next}
            submitLabel="Purchase"
            isPending={createCreditMutation.isPending}
            isSuccess={createCreditMutation.isSuccess}
            enabled={selectedPanelIds.size > 0}
          />
        </Payment.PaymentGroup>
      </div>
    </>
  );
};

export const AddOnPanelsStep = () => (
  <SplitScreenLayout title="Add-on lab tests" className="bg-zinc-50">
    <AddOnPanelsContent />
  </SplitScreenLayout>
);
