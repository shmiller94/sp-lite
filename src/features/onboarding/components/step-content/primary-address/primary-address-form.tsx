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
import { useUser } from '@/lib/auth';
import {
  AddressInput,
  addressInputSchema,
  useUpdateProfile,
} from '@/shared/api/update-profile';

function FullPrimaryAddressForm({
  googleAddres,
}: {
  googleAddres: AddressInput;
}) {
  const { nextStep } = useStepper((s) => s);
  const {
    updateBlocked,
    updateServiceAddress,
    updateMicrobiomeAddress,
    updateToxinAddress,
  } = useOnboarding();
  const user = useUser();
  const primaryAddress = user.data?.primaryAddress?.address;

  const selectedAddress = primaryAddress ?? googleAddres;

  const getServiceabilityMutation = useGetServiceability();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressInputSchema),
    defaultValues: {
      line: selectedAddress?.line ?? [],
      postalCode: selectedAddress?.postalCode ?? '',
      city: selectedAddress?.city ?? '',
      state: selectedAddress?.state ?? '',
    },
  });

  const onSubmit = async (address: AddressInput) => {
    const { serviceable } = await getServiceabilityMutation.mutateAsync({
      data: {
        zipCode: address.postalCode,
        collectionMethod: 'IN_LAB',
      },
    });

    if (serviceable) {
      const user = await updateProfileMutation.mutateAsync({
        data: { activeAddress: { address } },
      });

      updateServiceAddress(user.primaryAddress ?? null);
      updateMicrobiomeAddress(user.primaryAddress?.address ?? null);
      updateToxinAddress(user.primaryAddress?.address ?? null);
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
          name="line"
          render={({ ...rest }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-white">Street address</FormLabel>
              <FormControl>
                <OnboardingInput
                  autoComplete="off"
                  placeholder="Street address"
                  onChange={(e) => form.setValue('line', [e.target.value])}
                  {...rest}
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
            <Spinner className="size-6" variant="primary" />
          ) : (
            'Confirm'
          )}
        </Button>
      </form>
    </Form>
  );
}

export function PrimaryAddressForm() {
  const [googleAddress, setGoogleAddress] = useState<
    AddressInput | undefined
  >();

  if (googleAddress) {
    return <FullPrimaryAddressForm googleAddres={googleAddress} />;
  }

  return (
    <AddressAutocomplete
      emptyMessage="No results."
      placeholder="Address"
      onSubmit={(address) => {
        setGoogleAddress(address);
      }}
    />
  );
}
