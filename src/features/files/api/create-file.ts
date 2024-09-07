import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getFilesQueryOptions } from '@/features/files/api/get-files';
import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { File as SPFile } from '@/types/api';

export const createFile = ({
  data,
}: {
  data: { file: File };
}): Promise<{ file: SPFile }> => {
  return api.post(
    `files?filename=${encodeURIComponent(data.file.name)}`,
    data.file,
    {
      headers: {
        'Content-Type': data.file.type || 'application/octet-stream',
      },
    },
  );
};

type UseCreatePlanOptions = {
  mutationConfig?: MutationConfig<typeof createFile>;
};

export const useCreateFile = ({
  mutationConfig,
}: UseCreatePlanOptions = {}) => {
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
    mutationFn: createFile,
  });
};
