import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";


export default function CollectionCard({ filteredCollections }) {
  return (
    <div>
      {filteredCollections.length === 0 ? (
        <div className="flex flex-col justify-center items-center mt-6">
          <p className="font-semibold">No collections found</p>
          <p className="text-sm">
            All collections curated by editors will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-x-1.5 gap-y-4 px-2 pb-6">
          {filteredCollections.map((collection) => (
            <Link
              href={`/shop/collection/${collection.id}`}
              key={collection.id}
              className="flex flex-col gap-2 bg-gray-100 rounded-lg px-2 "
              onClick={async () =>
                await incrementProductViews("collections", collection.id)
              } // Call the function on click
            >
              <div className="flex justify-between items-center mb-2 mt-3 px-2">
                <h1 className="text-base max-w-[14rem] font-semibold lg:mb-0 lg:mr-4">
                  {collection.title}
                </h1>
                <div className="flex gap-1 items-center">
                  <span className="lg:block hidden font-medium">View more</span>
                  <FaArrowRight className="text-lg" />
                </div>
              </div>
              <div className="flex overflow-auto gap-2 md:flex-col pb-2 snap-x snap-mandatory hide-scrollbar">
                {collection.images.map((image, index) => (
                  <Image
                    className="w-[45vw] md:w-[35vw] h-[15vh] object-cover rounded-md"
                    src={image.src}
                    width={500}
                    height={500}
                    alt=""
                  />
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
