import { type ReactElement } from 'react';

import { ActionableAccordion } from '@/components/shared/actionable-accordion';
import { useCredits } from '@/features/orders/api/credits';
import { CreditActionCard } from '@/features/orders/components/credit-action-card';

export const ActionableOrdersCard = () => {
  const creditsQuery = useCredits();
  const credits = creditsQuery.data?.credits ?? [];
  const items: ReactElement[] = [];

  for (const credit of credits) {
    items.push(<CreditActionCard key={credit.id} credit={credit} />);
  }

  return <ActionableAccordion>{items}</ActionableAccordion>;
};
