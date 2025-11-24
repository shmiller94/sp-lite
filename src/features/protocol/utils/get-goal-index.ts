import type { Goal } from '../api';

export function getGoalIndex(goals: Goal[], goalId: string): number {
  return goals.findIndex((goal) => goal.id === goalId);
}
