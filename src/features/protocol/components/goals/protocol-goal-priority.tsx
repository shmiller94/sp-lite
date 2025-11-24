import { cva } from 'class-variance-authority';

import { Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const getPriorityVariant = cva('', {
  variants: {
    priority: {
      'high-priority': 'text-pink-700',
      'medium-priority': 'text-yellow-700',
      'low-priority': 'text-green-700',
    },
    variant: {
      text: '',
      badge: 'rounded-full px-2 py-0.5',
    },
  },
  compoundVariants: [
    { priority: 'high-priority', variant: 'badge', class: 'bg-pink-700/10' },
    {
      priority: 'medium-priority',
      variant: 'badge',
      class: 'bg-yellow-700/10',
    },
    { priority: 'low-priority', variant: 'badge', class: 'bg-green-700/10' },
  ],
  defaultVariants: {
    variant: 'text',
  },
});

export const ProtocolGoalPriority = ({
  code,
  variant = 'text',
  className,
}: {
  code?: string;
  variant?: 'text' | 'badge';
  className?: string;
}) => {
  // Only render if the code is one of the expected values
  const validPriorities = ['high-priority', 'medium-priority', 'low-priority'];

  if (!code || !validPriorities.includes(code)) {
    return null;
  }

  const priority = code as 'high-priority' | 'medium-priority' | 'low-priority';

  const text = () => {
    switch (priority) {
      case 'high-priority':
        return 'High priority';
      case 'medium-priority':
        return 'Medium priority';
      case 'low-priority':
        return 'Low priority';
      default:
        return '';
    }
  };

  return (
    <Body2 className={cn(getPriorityVariant({ priority, variant }), className)}>
      {text()}
    </Body2>
  );
};
