import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon, TimerIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { AnimatedTooltip } from '@/components/ui/animated-tooltip/animated-tooltip';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import {
  CreateMessageInput,
  createMessageInputSchema,
  // useCreateMessage,
} from '../api/create-message';
import { MD_TEAM } from '../const';

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
    <div className="container flex flex-col items-center p-0">
      <div className="mt-[72px] hidden flex-col gap-6 md:flex">
        <div className="flex w-full flex-row items-center justify-center">
          <AnimatedTooltip items={MD_TEAM} disablePopover />
        </div>
        <h1 className="text-center text-5xl text-zinc-900">
          Message your care team
        </h1>
      </div>

      <Form {...form}>
        <form className="mt-[71px] hidden w-full max-w-[900px] flex-col gap-4 rounded-[32px] bg-white p-5 md:flex">
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
              <h3 className="text-base text-zinc-500">{`Response Time: < 8 hrs`}</h3>
            </div>
            <div className="flex items-center gap-5">
              <a className="flex items-center gap-2" href="sms:+12089842571">
                <SendIcon className="size-4" color="#71717A" />
                <h3 className="text-zinc-500">+1 (208) 984-2571</h3>
              </a>
              <Button form="create-message" type="submit">
                Send Message
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
