import React, { useState } from 'react';

import { ChevronLeft } from '@/components/icons/chevron-left-icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Body2 } from '@/components/ui/typography';

import type { Activity, Goal } from '../../../api';
import { useProtocolCheckout } from '../../../hooks/use-protocol-checkout';
import { ProtocolGoal } from '../../goals/protocol-goal';
import { ProtocolLayout } from '../../layouts/protocol-layout';

type GoalStepProps = {
  goal: Goal;
  activities: Activity[];
  allGoals?: Goal[];
  next: () => void;
  previous: () => void;
};

export function GoalStep({
  goal,
  activities,
  allGoals,
  next,
  previous,
}: GoalStepProps) {
  const { hasItem, addItem, removeItem, getItemsForGoal, getActivityId } =
    useProtocolCheckout();

  const initialSelections = new Set(
    activities.map((activity, index) =>
      getActivityId(activity, goal.id, index),
    ),
  );
  const [tempSelections, setTempSelections] =
    useState<Set<string>>(initialSelections);

  const handleSelectionChange = (activityId: string, selected: boolean) => {
    setTempSelections((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(activityId);
      } else {
        newSet.delete(activityId);
      }
      return newSet;
    });
  };

  const handleAddToProtocol = () => {
    let addedCount = 0;

    activities.forEach((activity, index) => {
      const activityId = getActivityId(activity, goal.id, index);

      if (tempSelections.has(activityId)) {
        if (!hasItem(activityId)) {
          addItem(activity, goal.id, index);
          addedCount++;
        }
      } else {
        if (hasItem(activityId)) {
          removeItem(activityId);
        }
      }
    });

    if (addedCount > 0) {
      toast.info(
        `Added ${addedCount} item${addedCount > 1 ? 's' : ''} to your protocol`,
      );
    } else {
      toast.info('Updated your protocol selections');
    }
    next();
  };

  const handleSkip = () => {
    const itemsForThisGoal = getItemsForGoal(goal.id);
    itemsForThisGoal.forEach((item) => removeItem(item.id));
    next();
  };

  return (
    <ProtocolLayout className="lg:pt-24">
      <div className="sticky top-20 hidden w-40 shrink-0 lg:block">
        <Button
          variant="ghost"
          className="group -ml-1.5 flex items-center gap-0.5 p-0"
          onClick={() => {
            previous();
          }}
        >
          <ChevronLeft className="-mt-px w-[15px] text-zinc-400 transition-all duration-150 group-hover:-translate-x-0.5 group-hover:text-zinc-600" />
          <Body2 className="text-zinc-500 transition-all duration-150 group-hover:text-zinc-700">
            Back
          </Body2>
        </Button>
      </div>
      <div className="mx-auto mb-24 w-full max-w-[680px] space-y-12">
        <ProtocolGoal
          goal={goal}
          activities={activities}
          allGoals={allGoals}
          tempSelections={tempSelections}
          onSelectionChange={handleSelectionChange}
          getActivityKey={(activity, index) =>
            getActivityId(activity, goal.id, index)
          }
        />
        {activities.length > 0 ? (
          <div className="space-y-2 px-6 lg:px-0">
            <Button
              onClick={handleAddToProtocol}
              className="w-full"
              disabled={tempSelections.size === 0}
            >
              Add to my protocol
            </Button>
            <Button variant="outline" onClick={handleSkip} className="w-full">
              Address this later
            </Button>
          </div>
        ) : (
          <div className="px-6 lg:px-0">
            <Button onClick={next} className="w-full">
              Continue
            </Button>
          </div>
        )}
      </div>
      <div className="hidden w-40 shrink-0 lg:block" />
    </ProtocolLayout>
  );
}
