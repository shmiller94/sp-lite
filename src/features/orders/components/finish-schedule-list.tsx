import { ActionableAccordion } from '@/components/shared/actionable-accordion';
import { H4 } from '@/components/ui/typography';
import { useCredits } from '@/features/orders/api/credits';
import { CreditActionCard } from '@/features/orders/components/credit-action-card';

export const FinishScheduleList = () => {
  const creditsQuery = useCredits();

  if (creditsQuery.isLoading) {
    return (
      <div className="h-[82px] w-full animate-pulse rounded-[20px] bg-zinc-200" />
    );
  }

  const credits = creditsQuery.data?.credits ?? [];

  if (credits.length === 0) return;

  return (
    <div className="space-y-2">
      <H4>Tasks</H4>
      <ActionableAccordion>
        {credits.map((credit) => (
          <CreditActionCard key={credit.id} credit={credit} />
        ))}
      </ActionableAccordion>
    </div>
  );
};
