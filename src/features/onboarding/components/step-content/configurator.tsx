import { useEffect } from 'react';

import { BaselineSummary } from '@/features/onboarding/components/configurator/baseline-summary';
import { ConfiguratorSections } from '@/features/onboarding/components/configurator/configurator-sections';
import { ConfiguratorLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { useAvailableSubscriptions } from '@/features/settings/api';

export const Configurator = () => {
  const updateMembership = useOnboarding((s) => s.updateMembership);
  const coupon = useOnboarding((s) => s.coupon);

  const availableSubscriptionsQuery = useAvailableSubscriptions({
    code: coupon ?? undefined,
  });

  const availableSubscriptions = availableSubscriptionsQuery.data ?? [];

  useEffect(() => {
    if (availableSubscriptions.length > 0) {
      updateMembership(availableSubscriptions[0]);
    } else {
      updateMembership(null);
    }
  }, [availableSubscriptions]);

  return <ConfiguratorSections />;
};

export const ConfiguratorStep = () => (
  <ConfiguratorLayout title="Configurator">
    <>
      <Configurator />
      <BaselineSummary />
    </>
  </ConfiguratorLayout>
);
