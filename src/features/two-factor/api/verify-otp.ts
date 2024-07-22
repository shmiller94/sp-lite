import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const verifyOtpInputSchema = z.object({
  otp: z.string().min(5, 'Required'),
});

export const verifyOtpOutputSchema = z.object({
  success: z.boolean(),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpInputSchema>;
export type VerifyOtpOutput = z.infer<typeof verifyOtpOutputSchema>;

export const verifyOtp = ({
  data,
}: {
  data: VerifyOtpInput;
}): Promise<VerifyOtpOutput> => {
  return api.post('/verify-otp', data);
};

type UseVerifyOtpOptions = {
  mutationConfig?: MutationConfig<typeof verifyOtp>;
};

export const useVerifyOtp = ({ mutationConfig }: UseVerifyOtpOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: verifyOtp,
  });
};
