import useSWR from 'swr';
import { getAllOrders, fetchProductsWithOrders, fetchProductsWithMostOrders } from '@/utils/functions';

export function useAllOrders() {
  const { data, error } = useSWR('allOrders', getAllOrders);

  return {
    allOrders: data,
    isLoading: !error && !data,
    isError: error,
  };
}


export function useAllOrderedProducts() {
  const { data, error } = useSWR('orderedProducts', fetchProductsWithOrders);

  return {
    orderedProducts: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const fetchTopProducts = async () => {
  const productsWithOrders = await fetchProductsWithMostOrders();
  // Sort products by order count in descending order and take the top 5
  const topProducts = productsWithOrders.sort((a, b) => b.orderCount - a.orderCount).slice(0, 5); // Will be adjusted to 10. Soon
  return topProducts;
};

export function useProductsWithMostOrders() {
  const { data, error } = useSWR('topOrderedProducts', fetchTopProducts);

  return {
    topOrderedProducts: data,
    isLoading: !error && !data,
    isError: error,
  };
}