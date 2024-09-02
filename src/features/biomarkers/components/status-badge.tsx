import React from 'react';

import { STATUS_TO_COLOR } from '@/features/biomarkers/const/status-to-color';
import { capitalize } from '@/utils/format';

export type StatusOption =
  | 'Optimal'
  | 'Normal'
  | 'High'
  | 'Low'
  | 'Pending'
  | 'Out of Range'
  | 'n/a';

export interface StatusBadgeProps {
  readonly status: StatusOption;
  readonly badge?: boolean;
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element {
  const { badge = true, status } = props;

  let displayStatus = capitalize(status.toLowerCase());

  const color = STATUS_TO_COLOR[status.toLowerCase()];

  if (status.toLowerCase() === 'unknown') {
    displayStatus = 'n/a';
  } else if (
    status.toLowerCase() === 'high' ||
    status.toLowerCase() === 'low'
  ) {
    displayStatus = 'Out of Range';
  }

  return (
    <div className="flex items-center space-x-3">
      {badge && (
        <svg
          className={`size-3 overflow-visible`}
          fill={color}
          viewBox="0 0 6 6"
          aria-hidden="true"
        >
          <circle cx={3} cy={3} r={3} />
        </svg>
      )}
      <span className="text-nowrap lg:text-base">{displayStatus}</span>
    </div>
  );
}
