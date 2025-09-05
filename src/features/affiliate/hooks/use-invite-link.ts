import React from 'react';

import { useUser } from '@/lib/auth';

export const useInviteLink = () => {
  const { data: user } = useUser();

  const link = React.useMemo(() => {
    if (!user) return '';
    return `https://app.superpower.com/register?invite=${user.id}`;
  }, [user]);

  return { link };
};
