import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { File } from '@/types/api';

export const getFileUrl = ({
  fileId,
}: {
  fileId: string;
}): Promise<{ file: File }> => {
  return api.get(`/files/url/${fileId}`);
};

export const getFileUrlQueryOptions = (fileId: string) => {
  return queryOptions({
    queryKey: ['fileUrl', fileId],
    queryFn: () => getFileUrl({ fileId }),
  });
};

type UseGetFileUrlOptions = {
  fileId: string;
  queryConfig?: QueryConfig<typeof getFileUrlQueryOptions>;
};

export const useGetFileUrl = ({
  fileId,
  queryConfig,
}: UseGetFileUrlOptions) => {
  return useQuery({
    ...getFileUrlQueryOptions(fileId),
    ...queryConfig,
  });
};
