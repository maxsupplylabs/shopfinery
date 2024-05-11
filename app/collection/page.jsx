import React from "react";
import { fetchAllDocumentsInCollection, fetchCollectionsByDepartment } from "@/utils/functions";
import Collections from '@/components/collections'

const Page = async () => {
 const collections = await fetchAllDocumentsInCollection('collections')
  return (
    <Collections collections={collections}  />
  );
};

export default Page;