import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import * as z from 'zod';

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
import { Input, NumericInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Body1, H3 } from '@/components/ui/typography';
import { US_STATES } from '@/const';
import { useCheckoutContext } from '@/features/auth/stores';
import { useCreateAddress, useEditAddress } from '@/features/users/api';
import { useUpdateUser } from '@/features/users/api/update-user';
import { cn } from '@/lib/utils';
import { AddressInput, formAddressInputSchema } from '@/types/address';
import type { User } from '@/types/api';
import { getState } from '@/utils/verify-state-from-postal';

import { BenefitDetailsLayout } from './benefit-details-layout';

const REQUIRED_MSG = 'This is required.';
const NAME_REGEX =
  /^([a-zA-Z0-9]{1})([a-zA-Z0-9-.,']*(\s[a-zA-Z0-9-.,']+)*[a-zA-Z0-9-.,']?)$/;
const biologicalSexSchema = z.enum(['MALE', 'FEMALE'], { error: REQUIRED_MSG });
const nameSchema = z
  .string({ error: REQUIRED_MSG })
  .min(1, REQUIRED_MSG)
  .min(2, 'Please enter your full first name.')
  .regex(NAME_REGEX, 'Must contain only English letters.');

const existingMemberDetailsSchema = z.object({
  gender: biologicalSexSchema,
  postalCode: z.string().min(5, {
    message: 'Please enter a valid zip code.',
  }),
});

const existingMemberNoAddressSchema = z.object({
  firstName: nameSchema,
  lastName: z
    .string({ error: REQUIRED_MSG })
    .min(1, REQUIRED_MSG)
    .min(2, 'Please enter your full last name.')
    .regex(NAME_REGEX, 'Must contain only English letters.'),
  gender: biologicalSexSchema,
  address: formAddressInputSchema,
});

interface ExistingMemberDetailsProps {
  currentUser: User;
  onPrev: () => void;
  onSubmit: () => Promise<void>;
}

interface ExistingMemberDetailsWithAddressProps extends ExistingMemberDetailsProps {
  primaryAddress: NonNullable<User['primaryAddress']>;
}

interface ExistingMemberScaffoldProps {
  email: string;
  onPrev: () => void;
  isBusy: boolean;
  submitDisabled: boolean;
  onSubmit: () => void;
  description: string;
  children: ReactNode;
}

interface BiologicalSexSelectProps {
  hasError: boolean;
  value: string | undefined;
  onChange: (value: string) => void;
}

interface ZipCodeInputProps {
  hasError: boolean;
  value: string;
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
}

const getDefaultGender = (user: User) => {
  if (user.gender === 'MALE' || user.gender === 'FEMALE') {
    return user.gender;
  }

  return undefined;
};

const ExistingMemberDetails = ({
  currentUser,
  onPrev,
  onSubmit,
}: ExistingMemberDetailsProps) => {
  const primaryAddress = currentUser.primaryAddress;
  if (primaryAddress == null) {
    return (
      <ExistingMemberDetailsWithoutAddress
        currentUser={currentUser}
        onPrev={onPrev}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <ExistingMemberDetailsWithAddress
      currentUser={currentUser}
      primaryAddress={primaryAddress}
      onPrev={onPrev}
      onSubmit={onSubmit}
    />
  );
};

const ExistingMemberDetailsWithAddress = ({
  currentUser,
  primaryAddress,
  onPrev,
  onSubmit,
}: ExistingMemberDetailsWithAddressProps) => {
  const processing = useCheckoutContext((s) => s.processing);
  const updateUserMutation = useUpdateUser();
  const editAddressMutation = useEditAddress();

  const form = useForm<z.infer<typeof existingMemberDetailsSchema>>({
    resolver: zodResolver(existingMemberDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      gender: getDefaultGender(currentUser),
      postalCode: primaryAddress.postalCode ?? '',
    },
  });

  const isSavingProfile =
    updateUserMutation.isPending || editAddressMutation.isPending;
  const isBusy = processing || isSavingProfile;

  const handleSubmit = async (
    data: z.infer<typeof existingMemberDetailsSchema>,
  ) => {
    const nextState = getState(data.postalCode)?.state;
    if (nextState == null) {
      toast.error('Please enter a valid ZIP code.');
      return;
    }

    await updateUserMutation.mutateAsync({
      data: {
        gender: data.gender,
      },
    });

    await editAddressMutation.mutateAsync({
      id: primaryAddress.id,
      data: {
        line: primaryAddress.line,
        city: primaryAddress.city,
        state: nextState ?? primaryAddress.state,
        postalCode: data.postalCode,
        use: primaryAddress.use,
      },
    });

    await onSubmit();
  };

  return (
    <Form {...form}>
      <ExistingMemberScaffold
        email={currentUser.email}
        onPrev={onPrev}
        isBusy={isBusy}
        submitDisabled={isBusy || !form.formState.isValid}
        onSubmit={form.handleSubmit(handleSubmit)}
        description="Before we add this benefit, we need your biological sex and ZIP code."
      >
        <FormField
          control={form.control}
          name="gender"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Biological Sex</FormLabel>
              <FormControl>
                <BiologicalSexSelect
                  hasError={fieldState.error != null}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <ZipCodeInput
                  hasError={fieldState.error != null}
                  value={field.value}
                  onBlur={field.onBlur}
                  name={field.name}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ExistingMemberScaffold>
    </Form>
  );
};

const ExistingMemberDetailsWithoutAddress = ({
  currentUser,
  onPrev,
  onSubmit,
}: ExistingMemberDetailsProps) => {
  const processing = useCheckoutContext((s) => s.processing);
  const updateUserMutation = useUpdateUser();
  const createAddressMutation = useCreateAddress();

  const form = useForm<z.infer<typeof existingMemberNoAddressSchema>>({
    resolver: zodResolver(existingMemberNoAddressSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: currentUser.firstName ?? '',
      lastName: currentUser.lastName ?? '',
      gender: getDefaultGender(currentUser),
    },
  });

  const isSavingProfile =
    updateUserMutation.isPending || createAddressMutation.isPending;
  const isBusy = processing || isSavingProfile;

  const handleSubmit = async (
    data: z.infer<typeof existingMemberNoAddressSchema>,
  ) => {
    const line = [data.address.line1];
    if (data.address.line2 != null && data.address.line2.trim() !== '') {
      line.push(data.address.line2);
    }

    const address: AddressInput = {
      line,
      city: data.address.city,
      state: data.address.state,
      postalCode: data.address.postalCode,
      use: 'home',
    };

    await updateUserMutation.mutateAsync({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
      },
    });

    await createAddressMutation.mutateAsync({
      data: address,
    });

    await onSubmit();
  };

  return (
    <Form {...form}>
      <ExistingMemberScaffold
        email={currentUser.email}
        onPrev={onPrev}
        isBusy={isBusy}
        submitDisabled={isBusy || !form.formState.isValid}
        onSubmit={form.handleSubmit(handleSubmit)}
        description="Before we add this benefit, we need your legal name, biological sex, and home address."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Legal first name"
                    variant={fieldState.error ? 'error' : 'default'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Legal last name"
                    variant={fieldState.error ? 'error' : 'default'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="gender"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Biological Sex</FormLabel>
              <FormControl>
                <BiologicalSexSelect
                  hasError={fieldState.error != null}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ExistingMemberPrimaryAddressForm />
      </ExistingMemberScaffold>
    </Form>
  );
};

const ExistingMemberScaffold = ({
  email,
  onPrev,
  isBusy,
  submitDisabled,
  onSubmit,
  description,
  children,
}: ExistingMemberScaffoldProps) => (
  <BenefitDetailsLayout
    onPrev={onPrev}
    processing={isBusy}
    submitDisabled={submitDisabled}
    onSubmit={onSubmit}
  >
    <div className="space-y-6">
      <div className="space-y-2">
        <H3 className="text-[#1E1E1E]">Complete your profile</H3>
        <Body1 className="text-zinc-500">{description}</Body1>
      </div>
      <div className="space-y-4">
        <ReadOnlyEmailField email={email} />
        {children}
      </div>
    </div>
  </BenefitDetailsLayout>
);

const ReadOnlyEmailField = ({ email }: { email: string }) => (
  <div className="space-y-2">
    <FormLabel>Email</FormLabel>
    <Input
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect="off"
      disabled
      readOnly
      value={email}
    />
  </div>
);

const BiologicalSexSelect = ({
  hasError,
  value,
  onChange,
}: BiologicalSexSelectProps) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger
      className={cn(
        'px-6 py-4',
        value != null
          ? 'text-primary'
          : hasError
            ? 'text-pink-700'
            : 'text-muted-foreground',
      )}
      variant={hasError ? 'error' : 'default'}
    >
      <SelectValue placeholder="Select biological sex" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="MALE">Male</SelectItem>
      <SelectItem value="FEMALE">Female</SelectItem>
    </SelectContent>
  </Select>
);

const ZipCodeInput = ({
  hasError,
  value,
  name,
  onBlur,
  onChange,
}: ZipCodeInputProps) => (
  <NumericInput
    variant={hasError ? 'error' : 'default'}
    placeholder="ZIP Code"
    maxLength={5}
    maxDigits={5}
    value={value}
    onBlur={onBlur}
    name={name}
    onChange={onChange}
  />
);

const ExistingMemberPrimaryAddressForm = () => {
  const form = useFormContext<z.infer<typeof existingMemberNoAddressSchema>>();
  const [input, setInput] = useState('');
  const [manualEntry, setManualEntry] = useState(false);
  const address = useWatch({
    control: form.control,
    name: 'address',
  });

  if (address != null || manualEntry) {
    return <ExistingMemberFullPrimaryAddressForm />;
  }

  const hasError = form.formState.errors.address != null;
  const hasUnselectedInput = input.trim() !== '' && address == null;
  const errorMessage =
    hasError && hasUnselectedInput
      ? 'Please select an address from the suggestions.'
      : 'Address is required.';

  return (
    <div className="mt-2 flex flex-col gap-4">
      <Label className="text-secondary" htmlFor="line1">
        Where should we provide your Superpower services?
      </Label>
      <div>
        <AddressAutocomplete
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          onBlur={() => {
            void form.trigger('address');
          }}
          name="line1"
          variant={hasError ? 'error' : 'default'}
          onFormSubmit={(addressValue) => {
            form.setValue('address', addressValue, { shouldValidate: true });
          }}
        />
        <Button
          type="button"
          variant="ghost"
          className="w-fit px-0 text-sm"
          onClick={() => {
            setManualEntry(true);
          }}
        >
          Can&apos;t find your address?
        </Button>
      </div>
      {hasError ? (
        <p className="text-sm font-medium text-destructive">
          <span className="flex items-center gap-3">
            <AlertCircle className="size-4 shrink-0 text-destructive" />
            <span>{errorMessage}</span>
          </span>
        </p>
      ) : null}
    </div>
  );
};

const ExistingMemberFullPrimaryAddressForm = () => {
  const form = useFormContext<z.infer<typeof existingMemberNoAddressSchema>>();
  const stateItems: ReactNode[] = [];
  for (const state of US_STATES) {
    stateItems.push(
      <SelectItem value={state.value} key={state.value}>
        {state.label}
      </SelectItem>,
    );
  }

  return (
    <div className="flex flex-col gap-x-8 gap-y-4">
      <FormField
        control={form.control}
        name="address.line1"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Address Line 1</FormLabel>
            <FormControl>
              <AddressAutocomplete
                onFormSubmit={(data) =>
                  form.setValue('address', data, { shouldValidate: true })
                }
                placeholder="Street address"
                {...field}
                variant={fieldState.error ? 'error' : 'default'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address.line2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2</FormLabel>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="Apartment, suite, etc. (optional)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3">
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-[58px]">
                      <SelectValue placeholder="State" asChild={false} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="text-zinc-600">
                    {stateItems}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address.postalCode"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <ZipCodeInput
                  hasError={fieldState.error != null}
                  value={field.value}
                  onBlur={field.onBlur}
                  name={field.name}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export { ExistingMemberDetails };
