import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

import { useAnalytics } from '@/hooks/use-analytics';
import { useLogout } from '@/lib/auth';
import { clearActiveLogin } from '@/lib/utils';

export const Route = createFileRoute('/logout')({
  component: LogoutComponent,
});

function LogoutComponent() {
  const logout = useLogout();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const { reset } = useAnalytics();
  const didLogoutRef = useRef(false);

  useEffect(() => {
    if (didLogoutRef.current) return;
    didLogoutRef.current = true;

    logout.mutate({});
    void navigate({ to: '/signin' });

    reset();
    clearActiveLogin();
    queryClient.removeQueries();
  }, [logout, navigate, queryClient, reset]);

  return null;
}
