import { ChevronLeft } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { Link } from '@/components/ui/link';
import { Body2 } from '@/components/ui/typography';
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
        return (
          <RescheduleDetails requestGroup={requestGroup} setMode={setMode} />
        );
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
      <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-4">
        <Link
          to="/orders"
          className="group -ml-1.5 flex items-center gap-0.5 p-0"
        >
          <ChevronLeft className="-mt-px w-[15px] text-zinc-400 transition-all duration-150 group-hover:-translate-x-0.5 group-hover:text-zinc-600" />
          <Body2 className="text-zinc-500 transition-all duration-150 group-hover:text-zinc-700">
            Back
          </Body2>
        </Link>
      </div>
      {content}
      <HealthcareServiceRescheduleFooter
        requestGroup={requestGroup}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
};
