import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { User } from '@/types/api';

interface ReactivateUserResponse {
  message: string;
  user: User;
}

export const reactivateUser = (id: string): Promise<ReactivateUserResponse> => {
  return api.post(`/admin/users/${id}/reactivate`);
};

export const useReactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
