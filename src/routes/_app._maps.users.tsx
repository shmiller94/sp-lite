import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

import { ContentLayout } from '@/components/layouts';
import { UsersList } from '@/features/users/components/users-list';
import { authenticatedUserQueryOptions } from '@/lib/auth';
import { ROLES } from '@/lib/authorization';

export const Route = createFileRoute('/_app/_maps/users')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient
      .ensureQueryData(authenticatedUserQueryOptions())
      .catch(() => null);
    if (user === null) {
      throw notFound();
    }
    if (!user.role.includes(ROLES.SUPER_ADMIN)) {
      throw redirect({ to: '/', replace: true });
    }
  },
  component: () => (
    <ContentLayout title="Admin - Users">
      <UsersList />
    </ContentLayout>
  ),
});
