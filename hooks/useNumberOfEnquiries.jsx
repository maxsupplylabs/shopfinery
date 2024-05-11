import useSWR from 'swr';
import { getNumberOfEnquiries } from '@/utils/functions';

export function useNumberOfEnquiries() {
  const { data, error } = useSWR('numberOfEnquiries', getNumberOfEnquiries);

  return {
    numberOfEnquiries: data,
    isLoading: !error && !data,
    isError: error,
  };
}
