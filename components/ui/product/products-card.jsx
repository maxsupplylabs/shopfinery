"use client";
import * as React from "react";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { IoFilter } from "react-icons/io5";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

import { GiLaurelsTrophy } from "react-icons/gi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RiShip2Line } from "react-icons/ri";


import { incrementProductViews } from "@/utils/functions";

import ShareButton from "@/components/ui/share-button";

import {
  calculateDiscountedPrice,
  renderVariations,
  handleAddToBagClick,
  limitString,
  updateBrowserHistory,
} from "@/utils/functions";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";


function parseCustomDate(date) {
  try {
    if (date && date.seconds && date.nanoseconds !== undefined) {
      // Firestore timestamp format
      const milliseconds = date.seconds * 1000 + date.nanoseconds / 1e6;
      return new Date(milliseconds);
    } else {
      throw new Error("Invalid date format");
    }
  } catch (error) {
    console.error(`Error parsing date: ${error.message}`);
    return null; // Return null or another default value in case of error
  }
}


function performSorting(products, sortOption) {
  switch (sortOption) {
    case "mostRecent":
      // Sorting by Most Recent (createdAt)
      return products.sort((a, b) => {
        const dateA = parseCustomDate(a.createdAt);
        const dateB = parseCustomDate(b.createdAt);
        return dateB - dateA;
      });

    case "lowToHigh":
      // Sorting by price low to high
      return products.sort((a, b) => a.price - b.price);

    case "highToLow":
      // Sorting by price high to low
      return products.sort((a, b) => b.price - a.price);

    default:
      // Default case: return the original array
      return products;
  }
}


function SortingButtons({ sortOption, onValueChange }) {
  const sortingOptions = [
    { label: 'Most Recent', value: 'mostRecent' },
    { label: 'High to Low Price', value: 'highToLow' },
    { label: 'Low to High Price', value: 'lowToHigh' },
  ];

  return (
    <div className="relative inline-flex items-center space-x-2">
      <select
        id="sortDropdown"
        className="appearance-none bg-transparent border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none ring-black focus:ring-1"
        value={sortOption}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {sortingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <MdOutlineKeyboardArrowDown className="text-xl" />
    </div>
    </div>
  );
}

export default function ProductsCard({ productsInCollection }) {
  const [sortOption, setSortOption] = useState('mostRecent');

  function handleValueChange(value) {
    setSortOption(value);
  }

  const sortedProducts = performSorting(productsInCollection, sortOption);

  if (productsInCollection.length === 0) {
    // Handle case when no products are found for the collection
    return <p>No products found for this collection</p>;
  }
  return (
    <div className="bg-gradient-to-t from-gray-100">
      <div className="flex justify-between items-center px-2 my-2 sticky top-0">
      <SortingButtons sortOption={sortOption} onValueChange={handleValueChange} />

        <div className="flex justify-center items-center">
          <div>
            <ShareButton text={""} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-1.5 gap-y-1.5 px-2 pb-8">
        {sortedProducts.map((product) => (
          <Link
            className="rounded-[2px] min-h-[8rem] bg-white md:hover:shadow-md"
            key={product.id}
            href={`/${product.id}`}
            onClick={() => {
              try {
                 incrementProductViews("products", product.id)
                 updateBrowserHistory(
                  product.id,
                  product.name,
                  product.images,
                  product.variations,
                  product.description,
                  product.price,
                  product.views
                );
                
              } catch (error) {
                console.log(error);
              }
            }
            } // Call the function on click
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
    </div>
  );
}

const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-8 bg-[#fafafc] w-full items-center justify-between rounded-md border border-slate-200 px-3 py-4 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  )
);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  )
);
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
