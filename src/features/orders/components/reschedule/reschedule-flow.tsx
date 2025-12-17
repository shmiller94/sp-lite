import React, { useState, useMemo } from 'react';

import { RequestGroup } from '@/types/api';

import { RescheduleConfirmation } from './reschedule-confirmation';
import { RescheduleDetails } from './reschedule-details';
import { HealthcareServiceRescheduleFooter } from './reschedule-flow-footer';
import { RescheduleMode } from './reschedule-mode';

export const RescheduleFlow = ({
  requestGroup,
}: {
  requestGroup: RequestGroup;
}) => {
  const [mode, setMode] = useState<RescheduleMode>('default');

  const content = useMemo(() => {
    switch (mode) {
      case 'default':
        return <RescheduleDetails requestGroup={requestGroup} />;
      case 'cancel':
      case 'reschedule':
        return (
          <RescheduleConfirmation requestGroup={requestGroup} mode={mode} />
        );
      default:
        return null;
    }
  }, [mode, requestGroup]);

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      {content}
      <HealthcareServiceRescheduleFooter
        requestGroup={requestGroup}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
};
