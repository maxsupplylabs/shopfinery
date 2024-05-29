import ProductDetails from "../../components/ui/product/productDetails";
import YouMightAlsoLIke from "../../components/ui/product/youMightAlsoLIke";
import {
  fetchDocumentFromFirestore,
  fetchSimilarProducts,
  fetchCollectionId,
} from "@/utils/functions";

export default async function Page({ params }) {
  const { productId } = params;
  const product = await fetchDocumentFromFirestore("products", productId);
  const collectionId = await fetchCollectionId(productId);
  const similarProducts = await fetchSimilarProducts(collectionId, productId);

  if (!collectionId) {
    // Handle case where the collection ID is not found
    return null;
  }

  return (
    <div>
      <ProductDetails productId={productId} />
      <YouMightAlsoLIke productsInCollection={similarProducts} />
    </div>
  );
}
