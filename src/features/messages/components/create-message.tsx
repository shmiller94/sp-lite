import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';

import {
  createMessageInputSchema,
  useCreateMessage,
} from '../api/create-message';

export const CreateMessage = () => {
  const { addNotification } = useNotifications();
  const createMessageMutation = useCreateMessage({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Message Send',
        });
      },
    },
  });

  return (
    <FormDrawer
      isDone={createMessageMutation.isSuccess}
      triggerButton={
        <Button size="sm" icon={<Plus className="size-4" />}>
          Create Message
        </Button>
      }
      title="Create Message"
      submitButton={
        <Button
          form="create-message"
          type="submit"
          size="sm"
          isLoading={createMessageMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="create-message"
        onSubmit={(values) => {
          createMessageMutation.mutate({ data: values });
        }}
        schema={createMessageInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Textarea
              label="Body"
              error={formState.errors['body']}
              registration={register('body')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
