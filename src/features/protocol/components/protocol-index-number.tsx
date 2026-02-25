import { H2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { COLOR_GRADIENTS } from '../const/color-gradients';

export const ProtocolIndexNumber = ({
  index,
  className,
}: {
  index: number;
  className?: string;
}) => {
  return (
    <H2
      className={cn(
        'bg-gradient-to-t bg-clip-text text-4xl font-normal text-transparent md:text-6xl',
        index === 0 && COLOR_GRADIENTS.red,
        index === 1 && COLOR_GRADIENTS.orange,
        index === 2 && COLOR_GRADIENTS.blue,
        className,
      )}
    >
      {index + 1}
    </H2>
  );
};
