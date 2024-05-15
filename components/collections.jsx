"use client";
import Link from "next/link";
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetTrigger = SheetPrimitive.Trigger;
import Image from "next/image";
import { IoFilter } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { incrementProductViews } from "@/utils/functions";
import { Separator } from "@/components/ui/separator";

import {
  initializeUserInFirestore,
  updateUserInFirestore,
} from "@/utils/functions";

import {
  // Sheet,
  SheetClose,
  // SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  // SheetTrigger,
} from "@/components/ui/sheet";

export default function Collections({ collections }) {
  useEffect(() => {
    // Check if the user has a unique identifier in localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // If no identifier exists, initialize a new user
      initializeUserInFirestore("collectionPage");
    } else {
      // If an identifier already exists, update it
      updateUserInFirestore("collectionPage");
      console.log("Returning user with ID:", userId);
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount
  // State to track selected filter options
  const [selectedFilterOptions, setSelectedFilterOptions] = useState([]);

  // State to store filtered collections
  const [filteredCollections, setFilteredCollections] = useState(collections);

  function performFiltering(collections, filterOptions) {
    if (!filterOptions.length) {
      return collections;
    }

    return collections.filter((collection) => {
      // Check if any of the filter options match the department of the collection
      return filterOptions.some((option) => collection.department === option);
    });
  }

  // Handler for updating selected filter options
  const handleFilterOptionClick = (option) => {
    setSelectedFilterOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((prevOption) => prevOption !== option)
        : [...prevOptions, option]
    );
  };

  // Handler for showing filtered results
  const handleShowResultsClick = () => {
    const newFilteredCollections = performFiltering(
      collections,
      selectedFilterOptions
    );
    setFilteredCollections(newFilteredCollections);
  };

  // Handler for resetting filters
  const handleResetFilters = () => {
    setSelectedFilterOptions([]);
    setFilteredCollections(collections);
  };
  return (
    <>
      <div className="mt-4">
        <div className="flex justify-end mb-2 pr-2 overflow-auto px-2 sticky top-[2.5rem] md:top-[85px] z-50 bg-white py-1">
          <Sheet>
            <SheetTrigger asChild className="">
              <Button variant="outline" className="top-52 sticky z-50 flex gap-2 items-center">
                <span>Filter</span>
                <IoFilter className="text-lg" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter by categories</SheetTitle>
              </SheetHeader>
              <div className="mb-8 mt-4 flex flex-col gap-4">
                {/* Women category */}
                <div className="">
                  <h3 className="font-medium text-center pb-2">Women</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={
                        selectedFilterOptions.includes("womensWatches")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() => handleFilterOptionClick("womensWatches")}
                      className="flex gap-2 items-center"
                    >
                      <span>Watches</span>
                    </Button>
                    <Button
                      variant={
                        selectedFilterOptions.includes("womensBagsAndLuggage")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() =>
                        handleFilterOptionClick("womensBagsAndLuggage")
                      }
                      className="flex gap-2 items-center"
                    >
                      <span className="block">Bags & Luggage</span>
                    </Button>
                    <Button
                      variant={
                        selectedFilterOptions.includes("womensShoes")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() => handleFilterOptionClick("womensShoes")}
                      className="flex gap-2 items-center"
                    >
                      <span>Shoes</span>
                    </Button>
                    {/* Add more buttons for Women category */}
                  </div>
                </div>
                {/* Men category */}
                <div className="">
                  <h3 className="font-medium text-center pb-2">Men</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={
                        selectedFilterOptions.includes("mensWatches")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() => handleFilterOptionClick("mensWatches")}
                      className="flex gap-2 items-center"
                    >
                      <span>Watches</span>
                    </Button>
                    <Button
                      variant={
                        selectedFilterOptions.includes("mensBagsAndLuggage")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() =>
                        handleFilterOptionClick("mensBagsAndLuggage")
                      }
                      className="flex gap-2 items-center"
                    >
                      <span className="block">Bags & Luggage</span>
                    </Button>
                    <Button
                      variant={
                        selectedFilterOptions.includes("mensShoes")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() => handleFilterOptionClick("mensShoes")}
                      className="flex gap-2 items-center"
                    >
                      <span>Shoes</span>
                    </Button>
                    {/* Add more buttons for Men category */}
                  </div>
                </div>
                {/* Others category */}
                <div className="">
                  <h3 className="font-medium text-center pb-2">Others</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={
                        selectedFilterOptions.includes("homeAndKitchen")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() => handleFilterOptionClick("homeAndKitchen")}
                      className="flex gap-2 items-center"
                    >
                      <span>Home & Kitchen</span>
                    </Button>
                    <Button
                      variant={
                        selectedFilterOptions.includes("appliances")
                          ? "solid"
                          : "outline"
                      }
                      onClick={() => handleFilterOptionClick("appliances")}
                      className="flex gap-2 items-center"
                    >
                      <span>Appliances</span>
                    </Button>
                    {/* Add more buttons for Others category */}
                  </div>
                </div>
              </div>
              <SheetFooter className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Button type="submit" onClick={handleShowResultsClick}>
                    Show result
                  </Button>
                </SheetClose>
                <Button variant="link" onClick={handleResetFilters}>
                  Reset filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <div>
          {filteredCollections.length === 0 ? (
            <div className="flex flex-col justify-center min-h-[70vh] items-center mt-6">
              <p className="font-semibold">No collection found</p>
              <p className="text-xs">
                Updates coming soon...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-4 px-2 pb-6">
              {filteredCollections.map((collection) => (
                <div key={collection.id}>
                  <Link
                    href={`/collection/${collection.id}`}
                    className="flex flex-col gap-2 "
                    onClick={() =>
                      incrementProductViews("collections", collection.id)
                    } // Call the function on click
                  >
                    <div className="px-2">
                      {/* <div className="flex justify-between w-full gap-1 items-center">
                        <h1 className="text-lg max-w-[14rem] font-semibold lg:mb-0 lg:mr-4">
                          {collection.title}
                        </h1>
                      </div> */}
                      <div>
                        {/* <FaArrowRight className="text-lg" /> */}
                        {/* {collection.views !== 0 ? (
                        <p className="text-xs text-gray-400">
                          <span className="text-orange-600">
                            {collection.views}+
                          </span>{" "}
                          views in the past 30 days
                        </p>
                      ) : (
                        ""
                      )} */}
                      </div>
                    </div>
                    {/* {collection.images.map((image, index) => ( */}
                    <div className="flex relativ flex-col justify-center items-center">
                      <div className="relative w-full pt-[100%]">
                        <Image
                          className="absolute w-full h-full top-0 left-0 object-cover rounded-full"
                          src={collection.images[0].src}
                          width={500}
                          height={500}
                          alt=""
                        />
                        {/* <div className="absolute bottom-0 left-0 right-0 mx-auto w-full md:max-w-fit md:px-6 rounded-lg text-[#FB7701] bg-[#FFF5EB]">
                          <p className="text-center text-[0.70rem] font-medium">
                            From GHc18
                            
                          </p>
                        </div> */}
                      </div>
                    </div>
                    <div className="mt-0">
                    <h3 className="text-center text-xs md:text-sm font-medium">
                      {collection.title}
                    </h3>
                  </div>
                    {/* <div className="flex overflow-auto gap-2 md:flex-col pb-2 snap-x snap-mandatory hide-scrollbar">
                      <Image
                        className="w-full md:w-[35vw] h-full object-cover rounded-full"
                        src={collection.images[0].src}
                        width={500}
                        height={500}
                        alt=""
                      />

                  </div> */}
                    {/* ))} */}
                  </Link>

                  {/* <Separator className="text-[#f5f5f7] my-4" /> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const SheetContent = React.forwardRef(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-white/70 backdrop-blur-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 dark:bg-slate-950",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-[90vw]  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);
