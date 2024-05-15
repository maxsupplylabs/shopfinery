"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RiShip2Line } from "react-icons/ri";
import { fetchProductsInDepartments, limitString } from "@/utils/functions";
import { useAllProducts } from "@/hooks/useAllProducts"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Explore() {
  const initialSelectedTab = localStorage.getItem("selectedTab");
  const [selectedTab, setSelectedTab] = useState(initialSelectedTab);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 100; // Number of products to display per page

  // Retrieve the selected department ID from localStorage if available
  const [selectedTabOnLoc, setSelectedTabOnLoc] = useState(initialSelectedTab || "recommendation");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Save the selected tab to localStorage whenever it changes
    localStorage.setItem("selectedTab", selectedTabOnLoc);
  }, [selectedTabOnLoc]);

  useEffect(() => {
    // Restore the selected tab from the URL query parameter if available
    const tab = searchParams.get("xp_tab");
    if (tab) {
      setSelectedTabOnLoc(tab);
    }
    // return null
  }, [searchParams]);

  const { products, isLoading, isError } = useAllProducts();
  //  console.log(products)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error Loading data</div>;
  }



  const productsInBagsAndLuggage = fetchProductsInDepartments(
    products,
    ["mensBagsAndLuggage", "womensBagsAndLuggage"]
  );
  const productsInWatches = fetchProductsInDepartments(products, [
    "mensWatches",
    "womensWatches",
  ]);

  const productsInHomeAndKitchen = fetchProductsInDepartments(
    products,
    ["homeAndKitchen", ""]
  );

  const productsInShoes = fetchProductsInDepartments(products, [
    "mensShoes",
    "womensShoes",
  ]);


  const productsInClothing = fetchProductsInDepartments(
    products,
    ["mensClothing", "womensClothing"]
  );

  const productsInAccessories = fetchProductsInDepartments(
    products,
    ["mensAccessories", "womensAccessories"]
  );

  const productsInElectronics = fetchProductsInDepartments(
    products,
    ["electronics", ""]
  );

  const productsInAppliances = fetchProductsInDepartments(
    products,
    ["appliances", ""]
  );

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    setCurrentPage(1); // Reset currentPage when switching tabs
        // Update the URL query parameter to reflect the selected tab
        router.push(`/?xp_tab=${tabName}`, { scroll: false });
    };
  const tabs = [
    {
      key: "recommendation",
      label: "All Categories",
      products: products,
    },
    {
      key: "bagsAndLuggage",
      label: "Bags & Luggage",
      products: productsInBagsAndLuggage,
    },
    {
      key: "accessories",
      label: "Accessories",
      products: productsInAccessories,
    },
    {
      key: "watches",
      label: "Watches",
      products: productsInWatches,
    },

    {
      key: "homeAndKitchen",
      label: "Home & Kitchen",
      products: productsInHomeAndKitchen,
    },
    {
      key: "shoes",
      label: "Shoes",
      products: productsInShoes,
    },
    {
      key: "clothing",
      label: "Clothing",
      products: productsInClothing,
    },

    {
      key: "electronics",
      label: "Electronics",
      products: productsInElectronics,
    },
    {
      key: "appliances",
      label: "Appliances",
      products: productsInAppliances,
    },
  ];

  const selectedTabData = tabs.find((tab) => tab.key === selectedTab);

  // Logic to calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = selectedTabData.products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen">
      <div className="flex justify-normal overflow-auto mb-4 px-2 sticky top-[2.5rem] md:top-[49px] z-50 bg-white py-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`mr-4 text-sm capitalize min-w-max py-1 font-medium ${selectedTab === tab.key ? "border-b-2 border-black/70" : "text-black/40"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-1.5 gap-y-1.5 px-2 pb-6 bg-gradient-to-t from-white from-10% via-gray-200 via-30% to-white to-90%">
        {currentProducts.map((product) => (
          <Link
            className="min-h-[8rem] bg-white md:hover:shadow-md"
            key={product.id}
            href={`/${product.id}`}
          >
            <div className="flex flex-col justify-start items-center">
              {product.images[0] &&
                <div className="relative w-full pt-[100%]">
                  <Image
                    className="absolute w-full h-full top-0 left-0 object-cover"
                    src={product.images[0].src}
                    width={500}
                    height={500}
                    alt=""
                  />
                </div>
              }
              {product.isFreeShipping && (
                <div className="inline-flex items-center bg-green-50 px-2 py-1 text-green-700 ring-0 ring-inset ring-green-600/20 w-full">
                  <RiShip2Line className="text-[10px]" />
                  <p className="text-green-700 text-[10px] px-1 md:text-sm">
                    {product.isFreeShipping ? `Free shipping` : ""}
                  </p>
                </div>
              )}
              <div className="py-1 px-2 w-full flex flex-col items-start">
                <h3 className="text-xs md:text-sm text-left">
                  {limitString(product.name, 24)}
                </h3>
                <div>
                    <p className="text-orange-500 text-xs md:text-sm">
                      {product.isAvailableInGhana ? `Available in Ghana` : "Pre-order"}
                    </p>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex text-sm text-left items-center gap-2 justify-start">
                    <p className="font-semibold text-[#000000]">
                      GHc{product.price}
                    </p>
                    {product.market_price === 0 || isNaN(product.market_price) ? "" : (
                      <div className="flex justify-center items-center gap-1">
                        <p className="text-xs text-black/40">
                          <span className="line-through">
                            GHc{product.market_price}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Pagination */}
      {/* <div className="flex justify-center mt-4">
        {selectedTabData.products.length > productsPerPage && (
          <ul className="flex">
            {Array.from({ length: Math.ceil(selectedTabData.products.length / productsPerPage) }, (_, index) => (
              <li key={index} className="mr-2">
                <button
                  onClick={() => paginate(index + 1)}
                  className={`bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors duration-300 ${currentPage === index + 1 ? "bg-gray-3 border-black border" : ""
                    }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}