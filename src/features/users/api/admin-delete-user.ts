import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { User } from '@/types/api';

interface DeleteUserResponse {
  message: string;
  user: User;
}

export const deleteUser = (id: string): Promise<DeleteUserResponse> => {
  return api.delete(`/admin/users/${id}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
