import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export type UpdateContactInput = {
  properties?: { [name: string]: string | boolean | number };
  notificationConsent?: {
    transactional?: {
      email?: boolean;
      sms?: boolean;
    };
    promotional?: {
      email?: boolean;
      sms?: boolean;
    };
  };
};

export const updateContact = ({
  data,
}: {
  data: UpdateContactInput;
}): Promise<{ contact: any }> => {
  return api.patch(`/notifications/contact`, data);
};

type UseUpdateContactOptions = {
  mutationConfig?: MutationConfig<typeof updateContact>;
};

export const useUpdateContact = ({
  mutationConfig,
}: UseUpdateContactOptions = {}) => {
  return useMutation({
    mutationFn: updateContact,
    ...mutationConfig,
  });
};
