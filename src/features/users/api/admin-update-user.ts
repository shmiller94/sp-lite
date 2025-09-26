import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { AdminUser } from '@/types/api';

interface UpdateUserRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

interface UpdateUserResponse {
  user: AdminUser;
}

export const updateUser = (
  id: string,
  data: UpdateUserRequest,
): Promise<UpdateUserResponse> => {
  return api.put(`/admin/users/${id}`, data);
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
