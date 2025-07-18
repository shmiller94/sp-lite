import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAnalytics } from '@/hooks/use-analytics';
import { useLogout } from '@/lib/auth';
import { clearActiveLogin } from '@/lib/utils';

export const LogoutRoute = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { reset } = useAnalytics();

  useEffect(() => {
    logout.mutate({});
    navigate('/signin');

    // Reset the user session
    reset();

    // kill access / refresh tokens so user wont be refetched immidiately
    clearActiveLogin();
    // needed to remove all previous user queries and refetch for the new one
    queryClient.removeQueries();
  }, []);

  return null;
};
