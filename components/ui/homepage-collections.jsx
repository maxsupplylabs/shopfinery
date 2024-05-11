"use client"
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { useTop10Collections } from "@/hooks/useTop10Collections"

export default function HomePageCollections() {
 const { collections, isLoading, isError } = useTop10Collections();
 if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error Loading data</div>;
  }
  return (

      <section>
        <Link href={'/collection'} className="flex items-center mb-2 w-min ml-2 pt-2">
          <h1 className="text-lg font-medium">
            <span>Collections</span>
          </h1>
          <span><IoIosArrowForward className="text-lg" /></span>
        </Link>
        <div className="m-auto overflow-auto pb-2 hide-scrollbar">
              <div className="grid grid-cols-5 grid-rows-2 md:grid md:grid-cols-7 gap-x-4 gap-y-2 w-max">
                {collections.map((collection) => (
                  <Link
                    className="flex flex-col justify-center items-center"
                    key={collection.id}
                    href={`/collection/${collection.id}`}
                  >
                      <div className="w-[4rem] h-[4rem] md:min-w-[6rem] md:min-h-[6rem]">
                        <Image
                          className="w-full h-full object-cover rounded-full"
                          src={collection.images[0].src}
                          width={300}
                          height={300}
                          alt=""
                        />
                      </div>
                    <div className="flex items-center min-h-[40px]">
                      <p className="text-center w-20 line-clamp-2 text-xs md:text-sm font-medium">
                        {collection.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
        </div>
      </section>
  );
}
