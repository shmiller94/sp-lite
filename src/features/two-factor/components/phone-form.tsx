import { PhoneIcon } from 'lucide-react';
import validator from 'validator';
import { z } from 'zod';

import { Form, Input } from '@/components/ui/form';

export type PhoneFormProps = {
  defaultValue?: string;
  onSubmit?: (phone: string) => void;
};

export function PhoneForm(props: PhoneFormProps): JSX.Element {
  const schema = z.object({
    phone: z.string().refine(validator.isMobilePhone),
  });

  const onSubmit = (values: { phone: string }) => {
    props.onSubmit && props.onSubmit(values.phone);
  };

  return (
    <Form
      onSubmit={onSubmit}
      schema={schema}
      className="mx-auto max-w-md space-y-12"
    >
      {({ register, formState }) => (
        <>
          <Input
            type="phone"
            placeholder="Phone number"
            error={formState.errors['phone']}
            registration={register('phone')}
            defaultValue={props.defaultValue}
            disabled
            className="h-14 rounded-xl border-white/20 bg-white/5 p-4 text-[16px] font-normal text-white caret-white placeholder:text-white placeholder:opacity-50 focus:border-white"
            icon={<PhoneIcon className="size-4" />}
          />
        </>
      )}
    </Form>
  );
}
