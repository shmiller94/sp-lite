import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Body1, H3 } from '@/components/ui/typography';
import {
  useValidateCode,
  ValidateInput,
  validateInputSchema,
} from '@/features/auth/api/validate-coupon-code';
import { updateAccessCode } from '@/utils/access-code';

interface CouponCodeAccessFormProps {
  codeValidated: () => void;
}

export function CouponCodeAccessForm({
  codeValidated,
}: CouponCodeAccessFormProps): JSX.Element {
  const [searchParams] = useSearchParams();
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof validateInputSchema>>({
    resolver: zodResolver(validateInputSchema),
    defaultValues: {
      accessCode: accessCode || '',
    },
  });

  const accessCodeQuery = useValidateCode({
    accessCode: accessCode ?? '',
    queryConfig: {
      enabled: !!accessCode,
    },
  });

  useEffect(() => {
    if (accessCodeQuery.isSuccess && accessCode) {
      codeValidated();
      updateAccessCode(accessCode);
    } else if (accessCodeQuery.isError) {
      form.setError('accessCode', {
        type: 'manual',
        message: 'Invalid access code. Please try again.',
      });
    }
  }, [accessCodeQuery.status, accessCode, codeValidated, form]);

  useEffect(() => {
    const rewardfulCoupon = (window as any).Rewardful?.coupon?.id;
    const rewardfulCode = searchParams.get('rewardfulCode') || rewardfulCoupon;

    // Note: The growth team added something to webflow that is auto-lowercasing this param
    // and means that we aren't picking it up otherwise.
    const code =
      searchParams.get('accessCode') || searchParams.get('accesscode');

    /**
     * Get priority to access code for now (that we get via ?accessCode=CODE)
     *
     * toUpperCase() for OUR coupon codes needs to happen on the FE so that on the backend
     * we can verify we don't uppercase all coupon codes
     *
     * Otherwise use rewardfulCoupon if present
     */
    if (code) {
      setAccessCode(code.toUpperCase().trim());
    } else if (rewardfulCode) {
      setAccessCode(rewardfulCode.trim());
    }
  }, [searchParams]);

  function onFormSubmit(values: ValidateInput) {
    form.clearErrors();
    queryClient.resetQueries({
      queryKey: ['accessCode', values.accessCode.trim()],
    });
    setAccessCode(values.accessCode.trim());
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-1.5">
        <H3 className="text-zinc-900">Welcome to Superpower</H3>
        <Body1 className="text-zinc-400">
          Please enter an access code to continue.
        </Body1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Access Code"
                        {...field}
                        className={
                          form.formState.errors.accessCode
                            ? 'border-pink-700 focus-visible:ring-0'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={accessCodeQuery.isLoading}>
              {accessCodeQuery.isLoading ? <Spinner /> : 'Next'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
