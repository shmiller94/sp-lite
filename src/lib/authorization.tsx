import * as React from 'react';

import { useUser } from './auth';

export enum ROLES {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MEMBER = 'MEMBER',
}

type RoleTypes = keyof typeof ROLES;

export const useAuthorization = () => {
  const user = useUser();

  /**
   * This is used when we need to make sure its admin actor acting on behalf of user
   */
  const checkAdminActorAccess = React.useCallback(() => {
    return !!user.data?.adminActor;
  }, [user.data]);

  /**
   * This is used to make sure user has role
   */
  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles.length === 0 || !user.data) {
        return false;
      }

      return user.data.role.some((role) => allowedRoles.includes(role));
    },
    [user.data],
  );

  return { checkAccess, checkAdminActorAccess, role: user.data?.role ?? [] };
};
