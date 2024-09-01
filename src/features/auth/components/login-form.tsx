import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { H1, H4 } from '@/components/ui/typography';
import { AuthInput } from '@/features/auth/components/auth-input';
import { LoginInput, loginInputSchema, useLogin } from '@/lib/auth';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const loginMutation = useLogin({
    onSuccess,
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-16">
      <div className="text-center">
        <H1 className="text-zinc-900">Welcome</H1>
        <H4 className="text-zinc-600">Please log in</H4>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            loginMutation.mutate(values);
          })}
          className="space-y-8"
        >
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <AuthInput
                      border="top"
                      placeholder="Email"
                      icon={<Mail className="size-4 text-zinc-400" />}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AuthInput
                      border="bottom"
                      placeholder="Password"
                      icon={<Lock className="size-4 text-zinc-400" />}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-3">
            <Button className="w-full" type="submit">
              {loginMutation.isPending ? <Spinner /> : 'Login'}
            </Button>
            <Button className="w-full" variant="outline" type="button">
              Join waitlist
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
