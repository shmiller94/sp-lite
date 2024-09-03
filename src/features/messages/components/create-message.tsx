import { zodResolver } from '@hookform/resolvers/zod';
import { TimerIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Body1 } from '@/components/ui/typography';

import {
  CreateMessageInput,
  createMessageInputSchema,
} from '../api/create-message';

export const CreateMessage = (): JSX.Element => {
  // const { addNotification } = useNotifications();
  // const createMessageMutation = useCreateMessage({
  //   mutationConfig: {
  //     onSuccess: () => {
  //     },
  //   },
  // });

  const form = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageInputSchema),
    defaultValues: {
      body: '',
    },
  });

  // const sendNoteFn = async (): Promise<void> => {
  //   await mutateAsync({
  //     text: `Your concierge longevity clinician will respond with details about your question.${
  //       message.length > 0 ? `\n\nAdditional Notes:\n\n${message}` : ''
  //     }`,
  //   });
  //
  //   setMessage('');
  // };

  return (
    <div className="flex flex-col">
      <Body1 className="text-zinc-500">
        Submit a message to your care team down below or text us instead at
        <span className="text-vermillion-900"> +1-208-984-2571</span>
      </Body1>

      <Form {...form}>
        <form className="mt-[71px] flex w-full flex-col gap-6">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="h-[150px] w-full resize-none rounded-[20px] px-[18px] py-6"
                    placeholder="Ask questions about your health, book appointments, and get answers from expert clinicians"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 px-4 ">
              <TimerIcon color="#71717A" className="size-4" />
              <Body1 className="text-zinc-500">{`Response Time: < 24 hrs on weekdays`}</Body1>
            </div>

            <Button form="create-message" type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
