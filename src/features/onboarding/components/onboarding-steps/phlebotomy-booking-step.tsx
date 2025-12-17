import { ScheduleFlow } from '@/features/orders/components/schedule/schedule-flow';
import { useUpdateTask } from '@/features/tasks/api/update-task';

const BookingContent = () => {
  const { mutateAsync: updateTaskProgress } = useUpdateTask();

  const onSuccess = async () => {
    await updateTaskProgress({
      taskName: 'onboarding',
      data: { status: 'completed' },
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <ScheduleFlow onSuccess={onSuccess} mode="phlebotomy" />
    </div>
  );
};

export const PhlebotomyBookingStep = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <BookingContent />
    </div>
  );
};
