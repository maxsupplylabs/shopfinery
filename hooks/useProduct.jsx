import useSWR from 'swr';
import { fetchProduct } from '@/utils/functions';

export function useProduct(productId) {
  const { data, error } = useSWR(['product', productId], () => fetchProduct(productId)); // Pass function reference instead of calling directly

  return {
    product: data,
    isLoading: !error && !data,
    isError: error,
  };
}
