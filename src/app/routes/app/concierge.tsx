import { ContentLayout } from '@/components/layouts';
import { Body1, Body2, H1 } from '@/components/ui/typography';
import { CreateMessageForm } from '@/features/messages/components/create-message-form';
import { MeetTeamDialog } from '@/features/messages/components/meet-team-dialog';
import { cn } from '@/lib/utils';

const NumberText = ({ className }: { className?: string }) => {
  return (
    <Body1 className={cn('hidden text-zinc-500 md:block', className)}>
      Submit a message to your care team down below or text us instead at
      <a href="sms:+14157422828" className="text-vermillion-900">
        {' '}
        +1-415-742-2828
      </a>
    </Body1>
  );
};

export const ConciergeRoute = () => {
  return (
    <ContentLayout
      title="Concierge"
      variant="noPadding"
      className="flex flex-col justify-between space-y-0"
    >
      <div className="space-y-10 px-6 py-16 sm:p-16">
        <div className="flex items-center justify-between gap-4 md:items-start">
          <div className="flex flex-col gap-4">
            <H1>Concierge</H1>
            <NumberText />
          </div>
          <MeetTeamDialog />
        </div>
        <NumberText className="block md:hidden" />
        <CreateMessageForm />
      </div>
      <div className="flex items-center justify-center border-t border-t-zinc-200 p-6 lg:px-24 lg:py-12">
        <Body2 className="text-zinc-500">
          As a reminder, Superpower is not intended for urgent or emergency
          care. If you are having a medical emergency, please call 911 or visit
          your nearest emergency room.
        </Body2>
      </div>
    </ContentLayout>
  );
};
