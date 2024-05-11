import useSWR from 'swr';
import { getAllOrders } from '@/utils/functions';

export function useAllOrders() {
  const { data, error } = useSWR('allOrders', getAllOrders);

  return {
    allOrders: data,
    isLoading: !error && !data,
    isError: error,
  };
}
