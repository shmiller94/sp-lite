import React from 'react';

import { Body2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { BiomarkerDataType, BiomarkerResult } from '@/types/api';
import { getDisplayComparator } from '@/utils/get-display-comparator';

interface ValueUnitProps {
  result?: BiomarkerResult;
  baseUnit: string;
  textClassName?: string;
  dataType?: BiomarkerDataType;
}

// Renders a biomarker's value + unit based on its dataType.
// codedValue -> shows valueCoded text, text -> shows valueText,
// quantity (default) -> shows comparator symbol + numeric value + unit.
export const BiomarkerValueUnit = ({
  result,
  baseUnit,
  textClassName,
  dataType = 'quantity',
}: ValueUnitProps): React.JSX.Element => {
  if (dataType === 'codedValue') {
    return (
      <div className="flex gap-1">
        <Body2 className={cn('md:text-base', textClassName)}>
          {result?.valueCoded ?? '-'}
        </Body2>
      </div>
    );
  }

  if (dataType === 'text') {
    return (
      <div className="flex gap-1">
        <Body2 className={cn('md:text-base', textClassName)}>
          {result?.valueText ?? '-'}
        </Body2>
      </div>
    );
  }

  const value =
    result?.quantity?.value !== undefined ? result?.quantity?.value : '-';
  const unit = result?.quantity?.unit || baseUnit || '';

  return (
    <div className="flex gap-1">
      {result?.quantity?.comparator && (
        <Body2 className={cn('', textClassName)}>
          {getDisplayComparator(result?.quantity?.comparator)}
        </Body2>
      )}
      <Body2 className={cn('md:text-base', textClassName)}>{value}</Body2>
      <Body2 className={cn('text-zinc-500 md:text-base', textClassName)}>
        {unit}
      </Body2>
    </div>
  );
};
