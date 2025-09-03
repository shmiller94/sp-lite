import { cva } from 'class-variance-authority';

import { Body2 } from '@/components/ui/typography';

const getPriorityVariant = cva('rounded-full px-2 py-0.5', {
  variants: {
    priority: {
      high: 'bg-pink-50 text-pink-700',
      medium: 'bg-yellow-50 text-yellow-700',
      low: 'bg-green-50 text-green-700',
      default: 'bg-zinc-50 text-zinc-700',
    },
  },
});

export const PlanGoalPriority = ({
  priority,
}: {
  priority?: 'high' | 'medium' | 'low';
}) => {
  if (!priority) return null;

  const text = () => {
    switch (priority) {
      case 'high':
        return 'High priority';
      case 'medium':
        return 'Medium priority';
      case 'low':
        return 'Low priority';
      default:
        return 'Unknown';
    }
  };

  return <Body2 className={getPriorityVariant({ priority })}>{text()}</Body2>;
};
