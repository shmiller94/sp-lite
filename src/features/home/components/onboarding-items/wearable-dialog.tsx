import { VitalLinkButton } from '@/features/settings/components/vital-button';
import { useUpdateTask } from '@/features/tasks/api/update-task';
import { useAnalytics } from '@/hooks/use-analytics';

export const WearableDialog = () => {
  const { mutate } = useUpdateTask();
  const { track } = useAnalytics();

  const handleWearableConnected = () => {
    mutate({
      data: { status: 'in-progress' },
      taskName: 'onboarding-wearable',
    });
    track('integrated_wearable');
  };

  return (
    <VitalLinkButton
      variant="outline"
      size="medium"
      className="bg-white"
      callback={handleWearableConnected}
    >
      Connect
    </VitalLinkButton>
  );
};
