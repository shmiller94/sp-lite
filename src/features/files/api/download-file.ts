import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

type DownloadFileDTO = {
  fileId: string;
};

export const downloadFile = async ({
  fileId,
}: DownloadFileDTO): Promise<Blob> => {
  return await api.get(`/files/${fileId}`, {
    responseType: 'blob',
  });
};

type UseDownloadFileOptions = {
  mutationConfig?: MutationConfig<typeof downloadFile>;
};

export const useDownloadFile = ({
  mutationConfig,
}: UseDownloadFileOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: downloadFile,
  });
};
