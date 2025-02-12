import {
  infiniteQueryOptions,
  useInfiniteQuery,
  useQuery,
  queryOptions,
} from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ProductsResponse } from '@/types/api';

type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getProducts = ({
  page,
  limit,
  search,
}: GetProductsParams = {}): Promise<ProductsResponse> => {
  const params: Record<string, string | number> = {};

  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;
  if (search?.trim()) params.search = search.trim();

  return api.get('/shop/products', { params });
};

//regular query options
export const getProductsQueryOptions = ({
  page,
  limit,
  search,
}: GetProductsParams = {}) => {
  return queryOptions({
    queryKey: ['products', { page, limit, search }],
    queryFn: () => getProducts({ page, limit, search }),
  });
};

type UseProductsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>;
};

export const useProducts = ({
  page,
  limit,
  search,
  queryConfig,
}: UseProductsOptions = {}) => {
  return useQuery({
    ...getProductsQueryOptions({ page, limit, search }),
    ...queryConfig,
  });
};

//infinite query options
export const getInfiniteProductsQueryOptions = ({
  limit = 30,
  search,
}: GetProductsParams = {}) => {
  return infiniteQueryOptions({
    queryKey: ['infinite-products', { limit, search }],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ page: pageParam, limit, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  });
};

type UseInfiniteProductsOptions = {
  limit?: number;
  search?: string;
  queryConfig?: QueryConfig<typeof getInfiniteProductsQueryOptions>;
};

export const useInfiniteProducts = ({
  queryConfig,
  limit,
  search,
}: UseInfiniteProductsOptions = {}) => {
  return useInfiniteQuery({
    ...getInfiniteProductsQueryOptions({ limit, search }),
    ...queryConfig,
  });
};
