import { ReactNode } from 'react';

import { Body1 } from '@/components/ui/typography';

import { getHealthGradeColor } from './utils';

export const HealthGradeComponent: ({
  grade,
}: {
  grade: string;
}) => ReactNode = ({ grade }) => {
  const backgroundColor = getHealthGradeColor(grade);
  return (
    <div
      className={`${backgroundColor} flex size-[28px] shrink-0 items-center justify-center rounded-full`}
    >
      <Body1>{grade}</Body1>
    </div>
  );
};
