import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import type { UseQueryOptions, UseMutationOptions } from 'react-query';

interface ApiHookOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  onError?: (error: TError) => void;
  retries?: number;
}

interface ApiMutationOptions<TData, TError, TVariables> extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  onError?: (error: TError) => void;
  retries?: number;
}

const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME = 30 * 60 * 1000; // 30 minutes
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;

export function useApiQuery<TData = unknown, TError = unknown>(
  key: string | string[],
  fetcher: () => Promise<TData>,
  options?: ApiHookOptions<TData, TError>
) {
  return useQuery<TData, TError>(
    key,
    async () => {
      try {
        return await fetcher();
      } catch (error) {
        console.error(`Query error for key ${key}:`, error);
        throw error;
      }
    },
    {
      retry: options?.retries ?? DEFAULT_RETRIES,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: DEFAULT_STALE_TIME,
      cacheTime: DEFAULT_CACHE_TIME,
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'An error occurred');
        options?.onError?.(error);
      },
      ...options,
    }
  );
}

export function useApiMutation<TData = unknown, TError = unknown, TVariables = unknown>(
  key: string | string[],
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: ApiMutationOptions<TData, TError, TVariables>
) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>(
    async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        console.error(`Mutation error for key ${key}:`, error);
        throw error;
      }
    },
    {
      retry: options?.retries ?? DEFAULT_RETRIES,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(key);
        options?.onSuccess?.(data, variables, context);
        toast.success('Operation completed successfully');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'An error occurred');
        options?.onError?.(error);
      },
      onSettled: (data, error, variables, context) => {
        options?.onSettled?.(data, error, variables, context);
      },
      ...options,
    }
  );
}

export function useApiInfiniteQuery<TData = unknown, TError = unknown>(
  key: string | string[],
  fetcher: (pageParam?: any) => Promise<TData>,
  options?: ApiHookOptions<TData, TError> & { getNextPageParam?: (lastPage: any) => any }
) {
  return useQuery<TData, TError>(
    key,
    async () => {
      try {
        return await fetcher();
      } catch (error) {
        console.error(`Infinite query error for key ${key}:`, error);
        throw error;
      }
    },
    {
      retry: options?.retries ?? DEFAULT_RETRIES,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: DEFAULT_STALE_TIME,
      cacheTime: DEFAULT_CACHE_TIME,
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'An error occurred');
        options?.onError?.(error);
      },
      ...options,
    }
  );
}