import useSWR from "swr";
import { getAllCollections } from "@/utils/functions"

export function useAllCollections() {
    const { data, error } = useSWR("allCollections", getAllCollections)

    return {
        collections: data,
        isLoading: !error && !data,
        isError: error
    }
}