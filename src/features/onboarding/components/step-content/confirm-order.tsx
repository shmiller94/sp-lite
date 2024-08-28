import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStepper } from '@/components/ui/stepper';
import { Body1, Body2, H2 } from '@/components/ui/typography';
import { ImageContentLayout } from '@/features/onboarding/components/layouts';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/utils/format-money';

const FormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: 'Card number must be at least 16 digits.' }),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, {
    message: 'Expiration date must be in MM/YY format.',
  }),
  cvc: z
    .string()
    .min(3, { message: 'CVC must be at least 3 digits.' })
    .max(4, { message: 'CVC cannot exceed 4 digits.' }),
  zipCode: z
    .string()
    .min(5, { message: 'ZIP code must be at least 5 digits.' })
    .max(9, { message: 'ZIP code cannot exceed 9 digits.' }),
});

export const ConfirmOrder = () => {
  const { orderTotal } = useOnboarding();

  const { prevStep } = useStepper((s) => s);
  const [method, setMethod] = React.useState<string>('credit');
  return (
    <section id="main" className="flex flex-col gap-8">
      <H2 className="text-zinc-900">Confirm Order</H2>
      <div className="flex w-full items-center  justify-between rounded-[16px] bg-[#F7F7F7] px-6 py-5">
        <div>
          <Body1 className="text-zinc-900">
            {formatMoney(orderTotal / 12)} / month
          </Body1>
          <Body2 className="text-zinc-900 opacity-50">
            {formatMoney(orderTotal)} / year, billed annually
          </Body2>
        </div>
        <Button
          className="p-0 text-sm text-zinc-400"
          variant="ghost"
          onClick={prevStep}
        >
          Edit Plan
        </Button>
      </div>
      <H2 className="text-zinc-900">Payment</H2>
      <RadioGroup value={method} onValueChange={(value) => setMethod(value)}>
        <div
          className={cn(
            'flex items-center rounded-2xl border border-zinc-200 px-6 py-5',
            method === 'credit' ? 'bg-zinc-50' : null,
          )}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <Body1 className="text-zinc-600">Credit Card</Body1>

            <div className="flex flex-row items-center gap-x-6">
              <RadioGroupItem value="credit" />
            </div>
          </div>
        </div>
        <div
          className={cn(
            'flex items-center rounded-2xl border border-zinc-200 px-6 py-5',
            method === 'hsa' ? 'bg-zinc-50' : null,
          )}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <Body1 className="text-zinc-600">Pay with HSA/FSA</Body1>

            <div className="flex flex-row items-center gap-x-6">
              <RadioGroupItem
                value="hsa"
                className="min-h-5 min-w-5 border-zinc-200"
              />
            </div>
          </div>
        </div>
      </RadioGroup>
      {method === 'hsa' ? <HSACheckout /> : null}
      {method === 'credit' ? <CreditCardCheckout /> : null}
    </section>
  );
};

const HSACheckout = () => {
  return (
    <div className="flex flex-col gap-8">
      <Body1 className="text-zinc-500">
        After clicking “Confirm”, you will be redirected to TrueMed - Pay with
        HSA/FSA to complete your purchase securely.{' '}
      </Body1>
      <Button>Confirm</Button>
    </div>
  );
};

const CreditCardCheckout = () => {
  const { nextStep } = useStepper((s) => s);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cardNumber: '',
      expirationDate: '',
      cvc: '',
      zipCode: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // todo: add order checkout call here
    nextStep();
  }

  return (
    <div className="flex flex-col gap-8">
      <H2 className="text-zinc-900">Payment</H2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal text-zinc-500">
                  Card number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="1234567890"
                    className="rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-normal text-zinc-500">
                    Expiration date
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12/12"
                      className="w-full rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvc"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-normal text-zinc-500">
                    CVC
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="234"
                      className="w-full rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-normal text-zinc-500">
                    Zipcode
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Confirm</Button>
        </form>
      </Form>
    </div>
  );
};

export const ConfirmOrderStep = () => (
  <ImageContentLayout title="Confirm">
    <ConfirmOrder />
  </ImageContentLayout>
);
