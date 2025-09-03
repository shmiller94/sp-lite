import { Goal } from '@medplum/fhirtypes';

import { PlanMarkdown } from '../plan-markdown';

import { PlanGoalObservation } from './plan-goal-observation';

export type PlanGoalProps = {
  goal: Goal;
  index: number;
};

export function PlanGoal({ goal }: PlanGoalProps) {
  const goalObservations =
    (goal.addresses
      ?.map((a) => a.reference?.split('/')[1])
      .filter((r) => r !== undefined) as string[]) ?? [];

  const noteText = goal.note?.map((n) => n.text).join('\n\n') || '';

  return (
    <div className="space-y-6">
      {noteText && (
        <div>
          <PlanMarkdown content={noteText} />
        </div>
      )}

      {goalObservations.length > 0 && (
        <div className="space-y-2">
          <div className="space-y-2">
            {goalObservations.map((id) => (
              <PlanGoalObservation id={id} key={id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
