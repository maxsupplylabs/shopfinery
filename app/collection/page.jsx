"use client"
import React from "react";
// import { fetchAllDocumentsInCollection, fetchCollectionsByDepartment } from "@/utils/functions";
import Collections from '@/components/collections'
import { useAllCollections } from "@/hooks/useAllCollections";

const Page = () => {
  const { collections, isLoading, isError } = useAllCollections();
  if(isLoading) {
    return <div>Loading...</div>
  }

  if(isError) {
    return <div>Error loading data</div>
  }
  return (
    <Collections collections={collections}  />
  );
};

export default Page;