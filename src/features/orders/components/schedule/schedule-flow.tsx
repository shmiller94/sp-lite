import React from 'react';

import { ScheduleStoreProvider } from '../../stores/schedule-store';
import { ScheduleStoreProps } from '../../stores/schedule-store-creator';

import { ScheduleFlowSteps } from './schedule-steps';

export const ScheduleFlow: React.FC<ScheduleStoreProps> = ({
  onSuccess,
  mode,
}) => {
  return (
    <ScheduleStoreProvider onSuccess={onSuccess} mode={mode}>
      <div className="mx-auto w-full max-w-3xl py-8">
        <ScheduleFlowSteps />
      </div>
    </ScheduleStoreProvider>
  );
};
