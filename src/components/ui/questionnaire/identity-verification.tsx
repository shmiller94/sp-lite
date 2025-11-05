import { useStripe } from '@stripe/react-stripe-js';
import * as React from 'react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
// eslint-disable-next-line import/no-restricted-paths
import { useCreateVerificationSession } from '@/features/onboarding/api/create-verification-session';
import { useTask } from '@/features/tasks/api/get-task';
// eslint-disable-next-line import/no-restricted-paths
import { useUpdateTask } from '@/features/tasks/api/update-task';
import { useUser } from '@/lib/auth';

const ONBOARDING_TASK_NAME = 'onboarding-identity';

export const IdentityVerification = ({
  buttonCopy,
  handleIdentitySubmitted,
  shouldShow,
}: {
  buttonCopy?: string;
  handleIdentitySubmitted: () => void;
  shouldShow: boolean;
}) => {
  const [isIdentityExpired, setIsIdentityExpired] = React.useState(false);
  const stripe = useStripe();
  const createVerificationMutation = useCreateVerificationSession({});
  const idvTask = useTask({
    taskName: ONBOARDING_TASK_NAME,
  });
  const { mutate } = useUpdateTask();
  const { data: user } = useUser();

  const verify = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!stripe) return;

    try {
      const response = await createVerificationMutation.mutateAsync({});
      if (!response.clientSecret) {
        return;
      }

      /**
       * This uses clientSecret that stripe returns us and opens modal that is purely controlled by Stripe
       */
      const { error } = await stripe.verifyIdentity(response.clientSecret);

      if (error) {
        // NOTE: if we do want to show a toast on error, we should implement a formal error code handler for Stripe
        // otherwise, showing one is unnecessary for now for 'session_cancelled'
        // https://docs.stripe.com/error-codes
        toast.error(error.code);
        return;
      }
      handleIdentitySubmitted();
      if (idvTask.data?.task.status === 'draft') {
        mutate({
          data: { status: 'in-progress' },
          taskName: ONBOARDING_TASK_NAME,
        });
      }
    } catch (error) {
      toast.error('Unable to verify identity');
    }
  };

  const isIDVVerified = React.useMemo(() => {
    return user?.identityVerificationStatus === 'VERIFIED';
  }, [user?.identityVerificationStatus]);

  const isIDVExpired = React.useMemo(() => {
    if (!user?.identityUpdatedTime) {
      return true;
    }
    const identityUpdatedTime = new Date(user.identityUpdatedTime);
    const currentTime = new Date();
    const diffInMs = currentTime.getTime() - identityUpdatedTime.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    // considering IDV expired if older than 12 months
    return diffInDays > 365;
  }, [user?.identityUpdatedTime]);

  useEffect(() => {
    // need to use useEffect since we are interacting with external identity state
    if (!isIDVVerified || isIDVExpired) {
      setIsIdentityExpired(true);
    }
    if (isIDVVerified && !isIDVExpired) {
      handleIdentitySubmitted();
    }
  }, [handleIdentitySubmitted, isIDVExpired, isIDVVerified]);

  if (!shouldShow || !isIdentityExpired) {
    return null;
  }

  return (
    <Button
      onClick={verify}
      variant="outline"
      size="default"
      className="bg-white"
      style={{
        width: '100%',
      }}
    >
      {createVerificationMutation.isPending ? (
        <Spinner variant="primary" />
      ) : (
        buttonCopy || 'Verify Identity'
      )}
    </Button>
  );
};
