import Link from "next/link";
import Image from "next/image";
import { Separator } from "../separator";

export default async function SeeOtherCollections({ topCollections }) {
  return (
    <div>
      {topCollections.length === 0 ? null : (
        <div className="">
          <div className="flex justify-normal overflow-auto px-2 sticky top-[2.5rem] gap-2 md:top-[85px] bg-white py-1">
            {topCollections.map((collection) => (
              <Link
                className="rounded-lg p-1 flex flex-col"
                key={collection.id}
                href={`/collection/${collection.id}`}
              >
                <div className="flex relativ flex-col justify-center items-center">
                  <div className="relativ w-ful pt-[100%">
                    <Image
                      className="w-[3.5rem] h-[3.5rem] md:w-[4.5rem] md:h-[4.5rem] object-cover rounded-full"
                      src={collection.images[0].src}
                      width={500}
                      height={500}
                      alt=""
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-center w-min line-clamp-2 text-xs md:text-sm font-medium">
                    {collection.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Separator className='py-1 bg-gray-100'/>
    </div>
  );
}
