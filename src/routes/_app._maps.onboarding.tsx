import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { OnboardingFlow } from '@/features/onboarding/components/flow/onboarding-flow';
import { useTask } from '@/features/tasks/api/get-task';
import { preloadImage } from '@/utils/preload-image';

export const Route = createFileRoute('/_app/_maps/onboarding')({
  loader: async () => {
    const preloadedImages = [
      '/onboarding/shared/backgrounds/bg-female-face.webp',
      '/onboarding/shared/backgrounds/bg-male.webp',
      '/onboarding/shared/backgrounds/bg-spine.webp',
      '/onboarding/shared/backgrounds/bg-female-hands.webp',
    ];

    const imagesPromiseList: Array<ReturnType<typeof preloadImage>> = [];
    for (const src of preloadedImages) {
      imagesPromiseList.push(preloadImage(src));
    }

    await Promise.all(imagesPromiseList);
    return null;
  },
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const onboardingTask = useTask({
    taskName: 'onboarding',
  });

  const navigate = Route.useNavigate();
  const hasCheckedInitialLoad = useRef(false);

  useEffect(() => {
    if (onboardingTask.data == null) return;
    if (hasCheckedInitialLoad.current) return;

    if (onboardingTask.data.task.status === 'completed') {
      hasCheckedInitialLoad.current = true;
      void navigate({ to: '/', replace: true });
      return;
    }

    hasCheckedInitialLoad.current = true;
  }, [onboardingTask.data, navigate]);

  if (onboardingTask.isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner variant="primary" size="lg" />
      </div>
    );
  }

  if (onboardingTask.data == null) {
    return null;
  }

  return <OnboardingFlow />;
}
