import { ContentLayout } from '@/components/layouts';
import { Body1, Body2 } from '@/components/ui/typography';
import { CreateMessageForm } from '@/features/messages/components/create-message-form';

export const ConciergeRoute = () => {
  return (
    <ContentLayout title="Concierge" bgColor="zinc" className="!pb-0">
      {/*TODO: this is hacky and we should change that*/}
      <div className="flex min-h-[calc(100dvh-340px)] flex-col justify-between">
        <div className="flex flex-col">
          <Body1 className="text-zinc-500">
            Submit a message to your care team down below or text us instead at
            <a href="sms:+14157422828" className="text-vermillion-900">
              {' '}
              +1-415-742-2828
            </a>
          </Body1>
          <CreateMessageForm />
        </div>
      </div>
      <div className="flex items-center justify-center border-t border-t-zinc-200 py-[30px]">
        <Body2 className="text-zinc-500">
          As a reminder, Superpower is not intended for urgent or emergency
          care. If you are having a medical emergency, please call 911 or visit
          your nearest emergency room.
        </Body2>
      </div>
    </ContentLayout>
  );
};
