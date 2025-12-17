import { sleep } from '@medplum/core';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { TransactionSpinner } from '@/components/ui/spinner/transaction-spinner';
import { useAuthorization } from '@/lib/authorization';
import { cn } from '@/lib/utils';
import { OrderStatus, RequestGroup } from '@/types/api';

import { useUpdateOrder } from '../../api';

import { RescheduleMode } from './reschedule-mode';

export const HealthcareServiceRescheduleFooter = ({
  mode,
  setMode,
  requestGroup,
}: {
  mode: RescheduleMode;
  setMode: Dispatch<SetStateAction<RescheduleMode>>;
  requestGroup: RequestGroup;
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const updateOrderMutation = useUpdateOrder({});

  const isPastAppointment = requestGroup.startTimestamp
    ? new Date(requestGroup.startTimestamp) < new Date()
    : false;

  const canReschedule = requestGroup.appointmentType !== undefined;
  const isRevokedOrCompleted = [
    OrderStatus.revoked,
    OrderStatus.completed,
  ].includes(requestGroup.status);

  const { checkAdminActorAccess } = useAuthorization();
  const isAdminActor = checkAdminActorAccess();

  const showDefaultActions =
    (!isPastAppointment && !isRevokedOrCompleted && canReschedule) ||
    isAdminActor;

  const handleConfirm = async () => {
    await updateOrderMutation.mutateAsync({
      orderId: requestGroup.id,
      data: { status: 'revoked' },
    });

    if (mode === 'cancel') {
      // NOTE: do not add ?tab=orders here because we might hit a case where we would immidiately redirect
      // user but credit wouldnt be restored yet
      // I tried to approach this with waitUntil (draft order exists) but what if it was regular cancellation without credit?
      // if u find anything smarter - open PR
      navigate('/marketplace');
    }

    if (mode === 'reschedule') {
      // hack to make sure all credits are stored before moving to scheduling again
      setIsProcessing(true);
      await sleep(3000);
      setIsProcessing(false);
      navigate('/schedule');
      return;
    }
  };

  return (
    <div
      className={cn(
        'backdrop-blur-sm flex items-center md:justify-end gap-4 px-4 py-4 md:py-8',
      )}
    >
      {mode === 'default' && showDefaultActions ? (
        <>
          <Button
            variant="outline"
            className="w-full bg-white md:w-auto"
            onClick={() => setMode('cancel')}
          >
            Cancel appointment
          </Button>

          <Button
            className="w-full md:w-auto"
            onClick={() => setMode('reschedule')}
          >
            Reschedule
          </Button>
        </>
      ) : null}

      {mode === 'cancel' ? (
        <>
          <Button
            variant="outline"
            className="w-full bg-white md:w-auto"
            onClick={() => setMode('default')}
          >
            Go back
          </Button>
          <Button
            className="w-full md:w-auto "
            onClick={handleConfirm}
            disabled={updateOrderMutation.isPending || isProcessing}
          >
            {updateOrderMutation.isPending || isProcessing ? (
              <TransactionSpinner size="sm" />
            ) : (
              'Confirm cancellation'
            )}
          </Button>
        </>
      ) : null}

      {mode === 'reschedule' ? (
        <>
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => setMode('default')}
          >
            Cancel
          </Button>
          <Button
            className="w-full md:w-auto"
            onClick={handleConfirm}
            disabled={updateOrderMutation.isPending || isProcessing}
          >
            {updateOrderMutation.isPending || isProcessing ? (
              <TransactionSpinner size="sm" />
            ) : (
              'Confirm reschedule'
            )}
          </Button>
        </>
      ) : null}
    </div>
  );
};
