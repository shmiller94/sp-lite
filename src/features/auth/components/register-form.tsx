import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input/input';

import { Button } from '@/components/ui/button';
import { CalendarDatePicker } from '@/components/ui/calendar-date-picker/calendar-date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { H1, H4 } from '@/components/ui/typography';
import { useRegister, registerInputSchema, RegisterInput } from '@/lib/auth';

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registering = useRegister({ onSuccess });

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: undefined,
      password: '',
      dateOfBirth: {
        from: new Date(),
        to: new Date(),
      },
    },
    shouldUnregister: true,
  });

  function onSubmit(values: RegisterInput) {
    registering.mutate(values);
  }

  return (
    <div className="w-full max-w-[400px] space-y-8 py-12">
      <div className="space-y-3 text-center">
        <H1 className="text-zinc-900">Welcome to Superpower</H1>
        <H4 className="text-zinc-600">Your new era of personal health</H4>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          <div className="flex flex-col space-y-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Legal first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Legal last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <p className="mx-3 text-xl">+1</p>
                        <PhoneInput
                          {...field}
                          placeholder="Enter phone number"
                          maxLength={12}
                          international
                          country="US"
                          className="flex w-full rounded-xl border border-input bg-background p-4 text-base font-normal ring-offset-background placeholder:text-base  placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <CalendarDatePicker
                      className="items-start justify-start rounded-xl"
                      date={field.value}
                      onDateSelect={({ from, to }) => {
                        form.setValue('dateOfBirth', { from, to });
                      }}
                      variant="outline"
                      numberOfMonths={1}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biological Sex</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className={`bg-white ${field.value ? 'text-black' : ''}`}
                        >
                          <SelectValue placeholder="Select biological sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name@example.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        autoComplete="password"
                        autoCorrect="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <p className="px-8 text-center text-sm text-gray-400">
              By clicking register, you agree to our{' '}
              <span className="underline underline-offset-4 hover:text-black">
                <a
                  href="https://www.superpower.com/terms"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms of Service
                </a>{' '}
              </span>
              and{' '}
              <span className="underline underline-offset-4 hover:text-black">
                <a
                  href="https://www.superpower.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
              </span>
              .
            </p>
            <Button type="submit" disabled={registering.isPending}>
              {registering.isPending ? (
                <Spinner className="size-6" />
              ) : (
                'Register'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
