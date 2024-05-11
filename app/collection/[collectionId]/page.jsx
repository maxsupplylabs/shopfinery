import AboutCollection from "@/components/ui/collection/about-collection";
import ProductsCard from "@/components/ui/product/products-card";
import {
  fetchDepartmentId,
  fetchProductsInCollection,
  fetchAllDocumentsInCollection,
  fetchAllProductsFromFirestore,
  fetchTopCollectionIds,
  fetchDocumentFromFirestore,
  fetchTopCollections,
} from "@/utils/functions";
import SeeOtherCollections from "@/components/ui/collection/seeOtherCollections"

export default async function Page({ params }) {
  const { collectionId } = params;

  const departmentId = await fetchDepartmentId(collectionId)
  const topCollections = await fetchTopCollections(departmentId, collectionId)

  const allProducts = await fetchAllDocumentsInCollection("products");
  const productsInCollection = await fetchProductsInCollection(
    allProducts,
    collectionId
  );

  if (productsInCollection.length === 0) {
    // Handle case when no products are found for the collection
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] max-w-xs text-center m-auto">
        <p className="text-xl font-semibold">No item found</p>
        <p className="">Product updates coming soon.</p>
      </div>
    );
  }
  return (
    <div className="">
      <div>
        <SeeOtherCollections topCollections={topCollections} />
        <ProductsCard productsInCollection={productsInCollection} />
      </div>
    </div>
  );
}
