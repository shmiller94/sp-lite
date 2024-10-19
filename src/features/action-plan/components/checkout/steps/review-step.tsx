import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Body1 } from '@/components/ui/typography';
import { useProducts } from '@/features/action-plan/api';
import { CheckoutPrice } from '@/features/action-plan/components/checkout/checkout-price';
import { useCheckout } from '@/features/action-plan/stores/checkout-store';
import { usePlan } from '@/features/action-plan/stores/plan-store';
import { calculateTotals } from '@/features/action-plan/utils/calculate-totals';
import { useStepper } from '@/lib/stepper';
import { cn } from '@/lib/utils';
import { Product } from '@/types/api';

export const ReviewStep = (): JSX.Element => {
  const { nextStep } = useStepper((s) => s);
  const productsQuery = useProducts();
  const goals = usePlan((s) => s.goals);
  const { selectedProducts } = useCheckout((s) => s);

  const products = productsQuery.data?.products ?? [];

  const totals = calculateTotals(selectedProducts);

  return (
    <>
      <div className="flex max-h-[50vh] flex-col gap-6 overflow-auto py-4">
        {goals.map((goal, index) => {
          const productGoalItems = goal.goalItems.filter(
            (goalItem) => goalItem.itemType === 'PRODUCT',
          );

          if (productGoalItems.length > 0) {
            return (
              <div className="flex flex-col gap-4" key={index}>
                <Body1 className="px-10 text-zinc-500">
                  {goal.title.length ? goal.title : `Goal ${index + 1}`}
                </Body1>
                <div className="flex flex-col gap-1 px-6">
                  {productGoalItems.map((goalItem, index) => (
                    <ActionPlanProductCheckoutOptionRow
                      key={index}
                      item={products.find(
                        (product) => product.id === goalItem.itemId,
                      )}
                      initiallyChecked={
                        !!selectedProducts?.find(
                          (product) => product.id === goalItem.itemId,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
      <div className="flex w-full flex-col-reverse items-center gap-6 border-t border-t-zinc-200 p-5 md:w-auto md:flex-row md:justify-end">
        <div className="flex flex-col items-center md:items-end">
          <Body1 className="text-zinc-500">
            Subtotal ({selectedProducts.length} items)
          </Body1>
          <Body1>${totals.total.toFixed(2)}</Body1>
        </div>
        <Button
          onClick={nextStep}
          disabled={selectedProducts.length === 0}
          className="w-full md:w-auto"
        >
          Go to checkout
        </Button>
      </div>
    </>
  );
};

const ActionPlanProductCheckoutOptionRow = ({
  item,
  initiallyChecked,
}: {
  item?: Product;
  initiallyChecked: boolean;
}) => {
  const [checked, setChecked] = useState(initiallyChecked);
  const { updateSelectedProducts } = useCheckout((s) => s);

  if (!item) return null;

  const onItemClick = (): void => {
    setChecked((prev) => !prev);

    updateSelectedProducts(item);
  };

  return (
    <div
      className={cn(
        'flex cursor-pointer p-5 justify-between w-full items-center rounded-[20px] bg-zinc-100 gap-2',
      )}
      role="presentation"
      onClick={onItemClick}
    >
      <div className="flex items-center gap-4">
        <img
          alt={item.name}
          src={item.image}
          className="size-[64px] rounded-[12px] bg-white object-cover object-center"
        />

        <div className="flex flex-col gap-1">
          <Body1 className="line-clamp-1">{item.name}</Body1>
          <div>
            <CheckoutPrice item={item} />
          </div>
        </div>
      </div>
      <Checkbox
        checked={checked}
        className="size-5 data-[state=unchecked]:border-zinc-200 data-[state=unchecked]:bg-white"
      />
    </div>
  );
};
