import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

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
import { Body2 } from '@/components/ui/typography';
import { useGetServiceability } from '@/features/onboarding/api/get-serviceability';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { cn } from '@/lib/utils';
import { AddressInput, addressInputSchema } from '@/shared/api/update-profile';

export function EditAddressForm({
  setIsEditing,
}: {
  setIsEditing: () => void;
}) {
  const getServiceabilityMutation = useGetServiceability();
  const { address, updateAddress, isBlocked, updateBlocked } = useOnboarding();

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressInputSchema),
    defaultValues: {
      line1: address?.line1 ?? '',
      line2: address?.line2 ?? '',
      postalCode: address?.postalCode ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
    },
  });

  const onSubmit = async (address: AddressInput) => {
    const data = { postalCode: address.postalCode };

    const { serviceable } = await getServiceabilityMutation.mutateAsync({
      data,
    });

    if (serviceable) {
      // TODO: add primary address / active addresses update here
      updateAddress(address);
      setIsEditing();
      updateBlocked(false);
    } else {
      updateBlocked(true);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-zinc-500">
                Street Address
              </FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-zinc-500">
                Apt, Unit, etc.
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="Apt, Unit, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal text-zinc-500">
                  City
                </FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal text-zinc-500">
                  State
                </FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal text-zinc-500">
                  Zip code
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="ZIP Code"
                    className={cn(
                      isBlocked &&
                        'border border-[#B90090] bg-[#FFF3F6] focus-visible:bg-[#FFF3F6] focus-visible:ring-0',
                    )}
                    {...field}
                  />
                </FormControl>
                {!isBlocked && <FormMessage />}
              </FormItem>
            )}
          />
          {isBlocked && (
            <Body2 className="text-[#B90090]">
              Sorry, we’re unable to service your area right now. please go back
              and try a different address.
            </Body2>
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" type="button" onClick={setIsEditing}>
            Cancel
          </Button>
          <Button type="submit">
            {getServiceabilityMutation.isPending ? (
              <Spinner className="size-6" variant="light" />
            ) : (
              'Add address'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
