import { Plan, PlanGoalItemType } from '@/types/api';

export const filterGoalsByItemType = (
  itemType: PlanGoalItemType,
  actionPlan: Plan,
) => {
  // Check actionPlan goals is undefined, return empty array
  if (!actionPlan?.goals) {
    return [];
  }

  return actionPlan.goals
    .map((goal) => ({
      ...goal, // Spread operator to include all existing goal properties
      goalItems: goal.goalItems.filter(
        (goalItem) => goalItem.itemType === itemType,
      ),
    }))
    .filter((goal) => goal.goalItems.length > 0); // Filter out goals with no items of the specified type
};
