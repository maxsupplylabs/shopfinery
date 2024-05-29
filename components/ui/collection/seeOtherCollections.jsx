"use client"
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../separator";
import { incrementProductViews } from "@/utils/functions"

export default function SeeOtherCollections({ topCollections }) {
  return (
    <div>
      {topCollections.length === 0 ? null : (
        <div>
    <h1 className="px-2 text-sm font-semibold">Shop other collections</h1>
          <div className="flex justify-normal overflow-auto px-2 gap-2 bg-white py-1">
            {topCollections.map((collection) => (
              <Link
                className="rounded-lg p-1 flex flex-col"
                key={collection.id}
                href={`/collection/${collection.id}`}
                onClick={() =>
                  incrementProductViews("collections", collection.id)
                }
              >
                <div className="flex flex-col justify-center items-center">
                {collection.images.length > 0 ? (

                  <div>
                    <Image
                      className="w-[3.5rem] h-[3.5rem] md:w-[4.5rem] md:h-[4.5rem] object-cover rounded-full"
                      src={collection.images[0].src}
                      width={500}
                      height={500}
                      alt=""
                    />
                  </div>
                  ) : (
                    <div>
                      <Image
                      className="w-[3.5rem] h-[3.5rem] md:w-[4.5rem] md:h-[4.5rem] object-cover rounded-full"
                      src={"/placeholder-image.jpeg"}
                      width={500}
                      height={500}
                      alt=""
                    />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-center w-min line-clamp-2 text-black/60 text-xs md:text-sm">
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
