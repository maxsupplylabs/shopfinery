import useSWR from 'swr';
import { getVisitorsWithOrders } from '@/utils/functions';

export function useVisitorsWithOrders() {
  const { data, error } = useSWR('visitorsWithOrders', getVisitorsWithOrders);

  return {
    visitors: data,
    isLoading: !error && !data,
    isError: error,
  };
}
