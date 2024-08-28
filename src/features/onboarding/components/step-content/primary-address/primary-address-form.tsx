import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AddressAutocomplete } from '@/components/ui/address-autocomplete';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { useStepper } from '@/components/ui/stepper';
import { useGetServiceability } from '@/features/onboarding/api/get-serviceability';
import { OnboardingInput } from '@/features/onboarding/components/onboarding-input';
import { useOnboarding } from '@/features/onboarding/stores/onboarding-store';
import { AddressInput, addressInputSchema } from '@/shared/api/update-profile';

function FullPrimaryAddressForm() {
  const { nextStep } = useStepper((s) => s);
  const { address, updateAddress, updateBlocked } = useOnboarding();
  const getServiceabilityMutation = useGetServiceability();

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
      updateAddress(address);
      updateBlocked(false);
      nextStep();
    } else {
      updateBlocked(true);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-md space-y-8 text-left"
      >
        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-white">Street Address</FormLabel>
              <FormControl>
                <OnboardingInput
                  autoComplete="off"
                  placeholder="Address"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pt-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-white">Apt, Unit, etc.</FormLabel>
              <FormControl>
                <OnboardingInput
                  autoComplete="off"
                  placeholder="Apt, Unit, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage className="pt-2" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-white">City</FormLabel>
                <FormControl>
                  <OnboardingInput
                    autoComplete="off"
                    placeholder="City"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="pt-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-white">State</FormLabel>
                <FormControl>
                  <OnboardingInput
                    autoComplete="off"
                    placeholder="State"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="pt-2" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-white">Zip Code</FormLabel>
              <FormControl>
                <OnboardingInput
                  autoComplete="off"
                  placeholder="ZIP Code"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pt-2" />
            </FormItem>
          )}
        />
        <Button type="submit" variant="white" className="w-full">
          {getServiceabilityMutation.isPending ? (
            <Spinner className="size-6" />
          ) : (
            'Confirm'
          )}
        </Button>
      </form>
    </Form>
  );
}

export function PrimaryAddressForm() {
  const { updateAddress } = useOnboarding();
  const [enableFullAddress, setEnableFullAddress] = useState(false);

  if (enableFullAddress) {
    return <FullPrimaryAddressForm />;
  }

  return (
    <AddressAutocomplete
      emptyMessage="No results."
      placeholder="Address"
      onSubmit={(address) => {
        setEnableFullAddress(true);
        updateAddress(address);
      }}
    />
  );
}
