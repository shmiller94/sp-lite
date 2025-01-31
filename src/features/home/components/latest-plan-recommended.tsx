import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Body1, Body2 } from '@/components/ui/typography';
import { useProducts } from '@/features/action-plan/api';
import { ActionPlanCheckoutModal } from '@/features/action-plan/components/checkout/checkout-modal';
import { PlanStoreProvider } from '@/features/action-plan/stores/plan-store';
import { HealthcareServiceDialog } from '@/features/orders/components/healthcare-service-dialog';
import { useServices } from '@/features/services/api';
import { Plan, PlanGoalItem } from '@/types/api';

export const LatestPlanRecommended = ({ plan }: { plan: Plan }) => {
  const items = plan.goals.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="space-y-2">
      <Body2 className="text-zinc-400">
        Recommended from your latest action plan
      </Body2>
      <PlanStoreProvider initialPlan={plan} isAdmin={false}>
        {items.map((i) =>
          i.goalItems.map((gi) => {
            switch (gi.itemType) {
              case 'PRODUCT':
                return <Product goalItem={gi} />;
              case 'SERVICE':
                return <Service goalItem={gi} />;
              default:
                return null;
            }
          }),
        )}
      </PlanStoreProvider>
    </div>
  );
};

const Product = ({ goalItem }: { goalItem: PlanGoalItem }) => {
  const productsQuery = useProducts();
  const products = productsQuery.data?.products ?? [];

  const product = products.find((p) => p.id === goalItem.itemId);

  if (product !== undefined) {
    return (
      <div className="flex gap-4 rounded-3xl bg-zinc-100 p-5">
        <img
          src={product?.image ?? ''}
          alt={product.name}
          className="size-12 rounded-lg object-cover"
        />
        <div>
          <Body1 className="line-clamp-1">{product.name}</Body1>
          <ActionPlanCheckoutModal>
            <Button className="p-0 text-sm text-zinc-400" variant="ghost">
              Get started
              <ChevronRight className="size-3" />
            </Button>
          </ActionPlanCheckoutModal>
        </div>
      </div>
    );
  }

  // Product not found, but title was previously saved
  if (goalItem.title !== undefined) {
    <div className="flex gap-4 rounded-3xl bg-zinc-100 p-5">
      <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        <div
          className="flex size-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs text-center font-medium"
          aria-label={`${goalItem.title} (unavailable)`}
        >
          Product Image Missing
        </div>
      </div>
      <div>
        <Body1 className="line-clamp-1">{goalItem.title}</Body1>
        <ActionPlanCheckoutModal>
          <Button className="p-0 text-sm text-zinc-400" variant="ghost">
            Get started
            <ChevronRight className="size-3" />
          </Button>
        </ActionPlanCheckoutModal>
      </div>
    </div>;
  }

  // Product does not have title fallback
  return;
};

const Service = ({ goalItem }: { goalItem: PlanGoalItem }) => {
  const servicesQuery = useServices();
  const services = servicesQuery.data?.services ?? [];

  const service = services.find((s) => s.id === goalItem.itemId);

  if (!service) return null;

  return (
    <div className="flex gap-4 rounded-3xl bg-zinc-100 p-5">
      <img
        src={service?.image ?? ''}
        alt={service.name}
        className="size-12 rounded-lg object-cover"
      />
      <div>
        <Body1 className="line-clamp-1">{service.name}</Body1>

        <HealthcareServiceDialog healthcareService={service}>
          <Button className="p-0 text-sm text-zinc-400" variant="ghost">
            Get started
            <ChevronRight className="size-3" />
          </Button>
        </HealthcareServiceDialog>
      </div>
    </div>
  );
};
