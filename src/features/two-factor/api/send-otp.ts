import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const sendOtpInputSchema = z.object({});

export type SendOtpInput = z.infer<typeof sendOtpInputSchema>;

export const sendOtp = ({ data }: { data: SendOtpInput }): Promise<void> => {
  return api.post('/send-otp', data);
};

type UseSendOtpOptions = {
  mutationConfig?: MutationConfig<typeof sendOtp>;
};

export const useSendOtp = ({ mutationConfig }: UseSendOtpOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: sendOtp,
  });
};
