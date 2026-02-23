import { createFileRoute } from '@tanstack/react-router';

import { AuthLayout } from '@/components/layouts';
import { SetPasswordForm } from '@/features/auth/components/set-password-form';

export const Route = createFileRoute('/setpassword/$id/$secret')({
  component: SetPasswordComponent,
});

function SetPasswordComponent() {
  const { id, secret } = Route.useParams();

  return (
    <AuthLayout title="Set password">
      <SetPasswordForm id={id} secret={secret} />
    </AuthLayout>
  );
}
