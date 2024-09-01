import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useLogout } from '@/lib/auth';

export const LogoutRoute = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    logout.mutate({});
    navigate('/auth/login');
  }, []);

  return null;
};
