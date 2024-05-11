import useSWR from 'swr';
import { getAllVisitors } from '@/utils/functions';

export function useVisitors() {
  const { data, error } = useSWR('numberOfVisitors', getAllVisitors);

  return {
    visitors: data,
    isLoading: !error && !data,
    isError: error,
  };
}
