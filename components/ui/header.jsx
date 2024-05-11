"use client"
// Import statements
import * as React from "react";
import { clsx } from "clsx";
import { lusitana } from "@/components/ui/fonts";
import Link from "next/link";
import { useStateContext } from "@/context/state-context";
import { IoBag } from "react-icons/io5";


export default function Header() {
  const { bagItems, getTotalQuantitiesInCart } = useStateContext();
  const totalQuantitiesInCart = getTotalQuantitiesInCart();

  return (
    <div className="bg-white border-b flex flex-col">
      <div className="px-2 flex justify-between items-center py-2 md:w-[98%] md:m-auto">
        <div className="flex flex-col items-center gap-1">
          <Link
            href={"/"}
            className={clsx(
              lusitana.className,
              "flex text-lg uppercase italic font-bold md:text-2xl"
            )}
          >
            Shopfinery Imports
          </Link>
        </div>

        <div>
          <Link className="" href={"/bag"}>
            <div>
              <IoBag className="text-3xl text-black" />
            </div>
            {totalQuantitiesInCart > 0 ? (
              <div
                className={`bg-black border border-white w-5 h-5 rounded-full absolute top-1 right-2 flex justify-center items-center text-white text-sm`}
              >
                <p>{totalQuantitiesInCart}</p>
              </div>
            ) : null}
          </Link>
        </div>
      </div>
    </div>
  );
}