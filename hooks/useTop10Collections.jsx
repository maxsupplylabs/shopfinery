import useSWR from "swr";
import { getTop10Collections } from "@/utils/functions"

export function useTop10Collections() {
    const { data, error } = useSWR("allCollections", getTop10Collections)

    return {
        collections: data,
        isLoading: !error && !data,
        isError: error
    }
}