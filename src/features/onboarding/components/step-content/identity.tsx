import { useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';
import { Spinner } from '@/components/ui/spinner';
import { useStepper } from '@/components/ui/stepper';
import { Body1, H2 } from '@/components/ui/typography';
import { useCreateVerificationSession } from '@/features/onboarding/api/create-verification-session';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useUser } from '@/lib/auth';

const loadingStates = [
  {
    text: 'Making sure everything checks out',
  },
  {
    text: 'Verifying your info, hang tight',
  },
  {
    text: 'Just a moment, ensuring security',
  },
  {
    text: 'Reviewing your details',
  },
  {
    text: 'Double-checking everything',
  },
  {
    text: 'Securing your connection',
  },
  {
    text: 'Cross-referencing your data',
  },
  {
    text: 'Checking all the boxes',
  },
  {
    text: 'Confirming your identity',
  },
];

export const Identity = () => {
  const { nextOnboardingStep } = useStepper((s) => s);
  const createVerificationMutation = useCreateVerificationSession({});

  // used for stripe error types that we get back
  const [stripeError, setStripeError] = useState<string | undefined>();
  // used to hide button when we do verification
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  // used in use effect to requery user
  const [longPollingUser, setLongPollingUser] = useState<boolean>(false);
  const { data: user, refetch: refetchUser } = useUser();
  const stripe = useStripe();

  /* Becuase of stripe ASYNC approach for this we need to introduce long polling until we get some result back */
  useEffect(() => {
    if (longPollingUser) {
      const interval = setInterval(async () => {
        const updatedUser = await refetchUser();
        /* Introduced to make sure the report is up to date (not the old one) */
        const sameReportId =
          user?.userIdentity?.reportId ===
          updatedUser.data?.userIdentity?.reportId;

        if (updatedUser?.data?.userIdentity?.status === 'VERIFIED') {
          clearInterval(interval);
          await nextOnboardingStep();
        } else if (updatedUser?.data?.userIdentity && !sameReportId) {
          clearInterval(interval); // Cleanup interval
          setLongPollingUser(false);
          setIsVerifying(false);
          setStripeError('unable-to-verify');
        }
      }, 5000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [longPollingUser]);

  /* Case when user closed the window but we still processing on background and he comes back */
  useEffect(() => {
    if (user?.userIdentity?.status === 'VERIFIED') {
      nextOnboardingStep();
    }
  }, [user?.userIdentity]);

  if (!stripe) {
    return null;
  }

  const verify = async () => {
    try {
      // Gets client secret that is required to start modal window
      const response = await createVerificationMutation.mutateAsync({});
      if (!response.clientSecret) {
        return;
      }

      setIsVerifying(true);

      // opens async modal that returns error back (or not)
      const { error } = await stripe.verifyIdentity(response.clientSecret);

      if (error) {
        setStripeError(error.type);
        setIsVerifying(false);
        return;
      }

      setLongPollingUser(true);
    } catch (error) {
      setIsVerifying(false);
    }
  };

  return (
    <section id="main">
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={longPollingUser}
        duration={5000}
      />

      <div className="mb-4 flex flex-col gap-8">
        <H2 className="text-zinc-900">
          Verify your identity to schedule your first blood test
        </H2>
        <Body1 className="text-[#71717A]">
          Get ready to take a selfie and a photo of a valid form of ID such as a
          driver’s license or passport.
        </Body1>
      </div>
      <div className="flex w-full justify-end py-12">
        {!isVerifying ? (
          <Button onClick={verify}>
            {createVerificationMutation.isPending ? (
              <Spinner className="size-6" variant="light" />
            ) : stripeError ? (
              'Try again'
            ) : (
              'Verify me'
            )}
          </Button>
        ) : null}
      </div>
    </section>
  );
};

export const IdentityStep = () => (
  <ImageContentLayout title="Identity" className="bg-female-stretching">
    <Identity />
  </ImageContentLayout>
);
