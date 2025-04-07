import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { H1, H4 } from '@/components/ui/typography';
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
    <div className="w-full max-w-[400px] space-y-8">
      <div className="space-y-3 text-center">
        <H1 className="text-zinc-900">Welcome to Superpower</H1>
        <H4 className="text-zinc-500">Your new era of personal health</H4>
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
