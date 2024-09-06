import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getFilesQueryOptions } from './get-files';

export const deleteFile = ({ fileId }: { fileId: string }) => {
  return api.delete(`/files/${fileId}`);
};

type UseDeleteFileOptions = {
  mutationConfig?: MutationConfig<typeof deleteFile>;
};

export const useDeleteFile = ({
  mutationConfig,
}: UseDeleteFileOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getFilesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteFile,
  });
};
