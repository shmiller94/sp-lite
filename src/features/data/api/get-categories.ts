import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Category } from '@/types/api';

export const getCategories = async (): Promise<{
  categories: Category[];
}> => {
  return await api.get('/biomarkers/categories');
};

export const getCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
};

type UseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>;
};

export const useCategories = ({ queryConfig }: UseCategoriesOptions = {}) => {
  return useQuery({
    ...getCategoriesQueryOptions(),
    ...queryConfig,
  });
};
