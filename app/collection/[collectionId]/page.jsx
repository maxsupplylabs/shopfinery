import ProductsCard from "@/components/ui/product/products-card";
import {
  fetchDepartmentId,
  fetchTopCollections,
} from "@/utils/functions";
import SeeOtherCollections from "@/components/ui/collection/seeOtherCollections"

export default async function Page({ params }) {
  const { collectionId } = params;

  const departmentId = await fetchDepartmentId(collectionId)
  const topCollections = await fetchTopCollections(departmentId, collectionId)

  return (
      <div>
        <SeeOtherCollections topCollections={topCollections} />
        <ProductsCard collectionId={collectionId} />
      </div>
  );
}
