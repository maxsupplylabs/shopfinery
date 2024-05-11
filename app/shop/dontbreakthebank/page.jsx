import ProductsCard from "@/components/ui/product/products-card";
import {
  fetchDocumentsWithMaxPrice
} from "@/utils/functions";

export default async function Page() {

    const maxPrice = 25
  const productsInCollection = await fetchDocumentsWithMaxPrice('products', maxPrice)

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
      <div>
        <ProductsCard productsInCollection={productsInCollection} />
    </div>
  );
}
