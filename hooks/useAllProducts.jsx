import useSWR from 'swr';
import { getAllProduts } from '@/utils/functions';

export function useAllProducts() {
  const { data, error } = useSWR('allProducts', getAllProduts);

  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
  };
}
