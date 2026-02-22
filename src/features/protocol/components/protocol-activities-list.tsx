import type { Activity } from '../api';

import { ProtocolItemCard } from './protocol-item-card';

type ProtocolActivitiesListProps = {
  activities: Activity[];
  tempSelections?: Set<string>;
  onSelectionChange?: (activityKey: string, selected: boolean) => void;
  getActivityKey?: (activity: Activity, index: number) => string;
};

export function ProtocolActivitiesList({
  activities,
  tempSelections,
  onSelectionChange,
  getActivityKey,
}: ProtocolActivitiesListProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {activities.map((activity, index) => {
        const key = `activity-${index}`;
        const activityId = getActivityKey?.(activity, index) ?? key;

        const selected = tempSelections?.has(activityId);
        const handleSelectionChange = onSelectionChange
          ? (selected: boolean) => onSelectionChange(activityId, selected)
          : undefined;

        return (
          <ProtocolItemCard
            key={key}
            activity={activity}
            selected={selected}
            onSelectChange={handleSelectionChange}
          />
        );
      })}
    </div>
  );
}
