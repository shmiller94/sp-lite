import {
  UseMutationOptions,
  DefaultOptions,
  QueryClient,
} from '@tanstack/react-query';

export const queryConfig = {
  queries: {
    // throwOnError: true,
    // if this is true, then even if you invalidate query it won't refetch it if staleTime is still active
    // https://stackoverflow.com/questions/76670546/invalidate-all-queries-but-refetch-only-active
    //refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  },
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
