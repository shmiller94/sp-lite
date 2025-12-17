import { ActionableAccordion } from '@/components/shared/actionable-accordion';
import { useCredits } from '@/features/orders/api/credits';

// NOTE(Nikita): there used to be care plans as well but I dont see any reason why actionable should include it
// potential TODO: if my assumption is correct actionable accordion can only accept credits
export const ActionableCards = () => {
  const creditsQuery = useCredits();

  const credits = creditsQuery.data?.credits ?? [];

  return <ActionableAccordion credits={credits} />;
};
