import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';
import {
  GRAIL_GALLERI_MULTI_CANCER_TEST,
  PRODUCT_TYPE_SUPPLEMENT,
  TOTAL_TOXIN_TEST,
} from '@/const';
import { useProducts } from '@/features/action-plan/api/get-products';
import { BlockEditor } from '@/features/action-plan/components/editor/editor';
import { ACTION_PLAN_INPUT_STYLE } from '@/features/action-plan/const/action-plan-input';
import { ACTION_PLAN_SAVE_DELAY } from '@/features/action-plan/const/delay';
import { usePlan } from '@/features/action-plan/stores/plan-store';
import { useServices } from '@/features/services/api/get-services';
import { cn } from '@/lib/utils';
import { PlanGoal } from '@/types/api';

import { ClinicianNotePopover } from './note-popover';
import { PlanItemList } from './plan-item-list';
import { ActionPlanItemRow } from './plan-item-row';

interface ActionPlanGoalProps {
  goal: PlanGoal;
  goalIndex: number;
  className?: string;
}

export function ActionPlanGoal({ goal, className }: ActionPlanGoalProps) {
  const isAdmin = usePlan((s) => s.isAdmin);

  const deleteGoal = usePlan((s) => s.deleteGoal);
  const changeGoalDescription = usePlan((s) => s.changeGoalDescription);
  const changeGoalTitle = usePlan((s) => s.changeGoalTitle);
  const updateActionPlan = usePlan((s) => s.updateActionPlan);
  const servicesQuery = useServices();
  const [showPhysicianDisclaimer, setShowPhysicianDisclaimer] = useState(false);
  const [showSupplementDisclaimer, setShowSupplementDisclaimer] =
    useState(false);

  const productsQuery = useProducts();

  const renderEditor = () => {
    switch (goal.type) {
      // case 'ANNUAL_REPORT_PROTOCOLS':
      //   return null;
      default:
        return (
          <BlockEditor
            initialContent={goal.description}
            onUpdate={(content) => changeGoalDescription(content, goal.id)}
          />
        );
    }
  };

  useEffect(() => {
    goal.goalItems.forEach((item) => {
      const service = servicesQuery.data?.services.find(
        (s) => s.id === item.itemId,
      );
      const product = productsQuery.data?.products.find(
        (p) => p.id === item.itemId,
      );

      switch (item.itemType) {
        case 'SERVICE':
          if (service?.name === GRAIL_GALLERI_MULTI_CANCER_TEST) {
            setShowPhysicianDisclaimer(true);
          }
          if (service?.name === TOTAL_TOXIN_TEST) {
            setShowPhysicianDisclaimer(true);
          }
          break;
        case 'PRODUCT':
          if (product?.type?.valueOf() === PRODUCT_TYPE_SUPPLEMENT) {
            setShowSupplementDisclaimer(true);
          }
          break;
      }
    });
  }, [goal, servicesQuery.data?.services]);

  const getInputClassName = () => {
    // if (goal.type === 'ANNUAL_REPORT_PROTOCOLS') {
    //   return 'text-base placeholder:text-base';
    // }
    return 'text-xl placeholder:text-2xl';
  };

  const debouncedGoalTitle = useDebouncedCallback(async (value: string) => {
    changeGoalTitle(value, goal.id);
    await updateActionPlan();
  }, ACTION_PLAN_SAVE_DELAY);

  return (
    <div className={cn('flex w-full', className)}>
      <div className="w-full">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Goal title"
            className={cn(ACTION_PLAN_INPUT_STYLE, getInputClassName())}
            defaultValue={goal.title}
            onChange={(e) => debouncedGoalTitle(e.target.value)}
            disabled={!isAdmin}
          />
          {isAdmin && (
            <div
              role="presentation"
              className="flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
              onClick={() => deleteGoal(goal.id)}
            >
              <Trash2 width={20} height={20} color="#B90090" />
            </div>
          )}
        </div>

        {renderEditor()}

        {goal.type === 'ANNUAL_REPORT_PROTOCOLS' && !isAdmin ? (
          <>
            <ul className="ml-5 list-outside list-disc">
              {goal.goalItems.map((goalItem, idx) => (
                <PlanItemList item={goalItem} key={idx} />
              ))}
            </ul>
            {showSupplementDisclaimer ? (
              <div className="mt-2 rounded-lg bg-zinc-50 p-4 text-sm">
                <p className="mb-2">Disclaimer</p>
                <p className="text-zinc-500">
                  Consult your primary care physician before starting new
                  supplement, especially if you have health conditions or take
                  medications
                </p>
              </div>
            ) : null}
            {showPhysicianDisclaimer ? (
              <div className="mt-2 rounded-lg bg-zinc-50 p-4 text-sm">
                <p className="mb-2">Disclaimer</p>
                <p className="text-zinc-500">
                  The Grail Galleri test and the Total Toxins test are advanced
                  screenings that require further evaluation and approval by one
                  of SuperPower&#39;s qualified and licensed physicians or nurse
                  practitioners.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col gap-1">
            {goal.goalItems.map((goalItem) => (
              <ActionPlanItemRow
                goalId={goal.id}
                item={goalItem}
                key={goalItem.id}
              />
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="my-10">
            <ClinicianNotePopover goal={goal} />
          </div>
        )}
      </div>
    </div>
  );
}
