import useSWR from "swr";
import { getNumberOfDBTBVisitors } from "@/utils/functions"

export function useNumberOfDBTBVisitors() {
    const { data, error } = useSWR('numberOfDBTBVisitors', getNumberOfDBTBVisitors);
  
    return {
      numberOfDBTBVisitors: data,
      isLoading: !error && !data,
      isError: error,
    };
  }
  