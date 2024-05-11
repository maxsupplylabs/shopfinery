import Link from "next/link";

export default async function CollectionNavigation() {
  const menFashionId = "idmensfashion";
  const womenFashionId = "idwomensfashion";
  const homeAndKitchenId = "idhomeandkitchen";
  const sportsAndOutdoorId = "idsportsandoutdoor";
  const beautyAndHealthId = "idbeautyandhealth";

  return (
    <div className="overflow-auto flex justify-normal px-2 items-center">
      <Link
        href={`/shop/collection/${womenFashionId}`}
        className="bg-black/20 uppercase font-semibold min-w-max mr-4 text-xs py-4 px-2 rounded-2xl"
      >
        Women fashion
      </Link>
      <Link
        href={`/shop/collection/${menFashionId}`}
        className="bg-black/20 uppercase font-semibold min-w-max block mr-4 text-xs py-4 px-2 rounded-2xl"
      >
        Men fashion
      </Link>
      <Link
        href={`/shop/collection/${homeAndKitchenId}`}
        className="bg-black/20 uppercase font-semibold min-w-max block mr-4 text-xs py-4 px-2 rounded-2xl"
      >
        Home & Kitchen
      </Link>
      <Link
        href={`/shop/collection/${sportsAndOutdoorId}`}
        className="bg-black/20 uppercase font-semibold min-w-max block mr-4 text-xs py-4 px-2 rounded-2xl"
      >
        Sports & Outdoor
      </Link>
      <Link
        href={`/shop/collection/${beautyAndHealthId}`}
        className="bg-black/20 uppercase font-semibold min-w-max block mr-4 text-xs py-4 px-2 rounded-2xl"
      >
        Beauty & Health
      </Link>
    </div>
  );
}
