"use client";
import * as React from "react";
import { useProductsWithMostOrders } from "@/hooks/useAllOrders";
import Link from "next/link";
import Image from "next/image";
import { RiShip2Line } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";

export default function CurrentOrders() {
  const { topOrderedProducts, isLoading, isError } = useProductsWithMostOrders();

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching data</div>
  }

    // Filter orders based on selected time period
    const filteredOrders = topOrderedProducts.filter((productWithOrders) => {
      const orderDate = productWithOrders.orders[0].timestamp.toDate();
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
      return orderDate >= monthStart && orderDate <= today;
    });

  if (filteredOrders.length === 0) {
    return null
  }
  return (
    <Link href="/current-batch-orders" className="m-2 px-1 bg-gradient-to-b from-pink-300 from-5% via-white via-25% to-white to-90% rounded-sm">
      <div className="flex justify-between items-center py-1">
      <h1 className="font-semibold italic">Batch Orders</h1>
      <div className="flex items-center gap-1 opacity-70 text-sm">
        <p>Closing on 25th June</p>
        <IoIosArrowForward />
      </div>
      </div>
      <div className="m-auto overflow-auto hide-scrollbar">
        {/* Grid cols will be adjusted to 10 soon */}
        <div className="grid grid-cols-5 md:grid md:grid-cols-7 gap-x-1 gap-y-2 w-max">
          {filteredOrders.map((product) => (
            <div
              className="flex flex-col justify-center items-center"
              key={product.orders[0].productId}
            >
              {product.orders[0].image ? (

                <div className="relative w-[8rem] h-[8rem] md:min-w-[6rem] md:min-h-[6rem]">
                  <Image
                    className="w-full h-full object-cover"
                    src={product.orders[0].image.src}
                    width={300}
                    height={300}
                    alt=""
                  />
                  {product.orders[0].isFreeShipping && (
                <div className="absolute bottom-0 flex items-center gap-1 bg-green-50 px-2 text-green-700  text-xs w-full">
                  <RiShip2Line className="text-[10px]" />
                  <p className="text-green-700 text-[10px] md:text-sm">
                    {product.orders[0].isFreeShipping ? `Free shipping` : ""}
                  </p>
                </div>
              )}
                </div>
              ) : (
                <div className="w-[6rem] h-[6rem] md:min-w-[6rem] md:min-h-[6rem]">
                  <Image
                    className="w-full h-full object-cover rounded-full"
                    src={"/placeholder-image.jpeg"}
                    width={500}
                    height={500}
                    alt=""
                  />
                </div>
              )}
              <div className="flex flex-col justify-start items-start pt-1">
                <p className="text-xs md:text-sm text-black font-bold">
                  <span className="text-[10px]">GHc</span>{product.orders[0].price}
                </p>
                <p className="text-xs md:text-sm text-black/60">
                  MOQ {product.orders[0].moq === 0 ? 1 : product.orders[0].moq}
                </p>
                <p className="w-[8rem] line-clamp-2 text-xs md:text-sm text-black/60">
                {new Set(product.orders.map(order => order.buyerName)).size === 1 ? `${new Set(product.orders.map(order => order.buyerName)).size} Person` : `${new Set(product.orders.map(order => order.buyerName)).size} People` } ordered
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
