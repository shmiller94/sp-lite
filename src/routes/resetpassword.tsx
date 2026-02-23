import { createFileRoute } from '@tanstack/react-router';

import { AuthLayout } from '@/components/layouts';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const Route = createFileRoute('/resetpassword')({
  component: ResetPasswordComponent,
});

function ResetPasswordComponent() {
  return (
    <AuthLayout title="Reset password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
