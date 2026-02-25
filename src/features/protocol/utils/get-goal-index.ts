import type { LegacyGoal, ProtocolGoal } from '../api';

export function getGoalIndex(
  goals: LegacyGoal[] | ProtocolGoal[],
  goalId: string,
): number {
  return goals.findIndex((goal) => goal.id === goalId);
}
