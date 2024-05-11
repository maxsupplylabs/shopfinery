"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "@/context/state-context";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../separator";
import {
  calculateDiscountedPrice,
  // renderVariations,
  handleAddToBagClick,
  limitString,
  initializeUserInFirestore,
  updateUserInFirestore,
  incrementEnquiryNumber,
  updateBrowserHistory,
} from "@/utils/functions";
import { RiShip2Line } from "react-icons/ri";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/productDetailsCarousel";

import { PiWarningCircle } from "react-icons/pi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductImageCarousel } from "@/components/ui/product-image-carousel"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Helper function to render product variations
export const renderVariations = (
  selectedProduct,
  selectedVariations,
  handleVariationSelect
) => (
  <div className="flex flex-col gap-4">
    {selectedProduct.variations.map((variation) => (
      <div key={variation.type} className="flex flex-col gap-1">
        <strong className="text-sm w-min capitalize">{variation.type}s</strong>
        <div className="grid grid-cols-3 grid-flow-row-dense overflow-auto gap-2 pb-2 snap-x snap-mandatory hide-scrollbar capitalize">
          {variation.values.map((value) => (
            <button
              key={value}
              onClick={(event) =>
                handleVariationSelect(variation.type, value, event)
              }
              className={`rounded-2xl px-2 text-sm py-1 capitalize ${selectedVariations[variation.type] === value
                ? "bg--500 text-black border border-black"
                : "border border-gray-300"
                }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

function CarouselDemo({ product }) {
  return (
    <Carousel className="hidden w-full sm:grid grid-cols-[auto_minmax(550px,_1fr)_auto] items-center">
      <CarouselPrevious />
      <CarouselContent>
        {product.images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              className="w-full overflow-auto h-[65vh] object-cover"
              src={image.src}
              width={500}
              height={500}
              alt=""
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  );
}

export default function ProductDetails({ product }) {
  const {
    bagItems,
    addToBag,
    selectedVariations,
    setSelectedVariations,
    handleVariationSelect,
  } = useStateContext();

  const [feedback, setFeedback] = useState(null);
  const [shippingInfoFeedback, setShippingInfoFeedback] = useState(false);

  // Initial state for the identity
  const [identity, setIdentity] = useState(1);

  useEffect(() => {
    // Interval to update the identity every 5 seconds
    const interval = setInterval(() => {
      // Update the identity (cycling from 1 to 2 and vice versa)
      setIdentity((prevIdentity) => (prevIdentity === 1 ? 2 : 1));
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run the effect only once on mount

  const handleFeedback = (value) => {
    // Set feedback in state
    setFeedback(value);
    setShippingInfoFeedback(true);

    // Store feedback in local storage
    localStorage.setItem("shippingInfoFeedback", value);
  };

  if (!product) {
    return <p>Product not found</p>;
  }

  const handleAddToBag = () => {
    handleAddToBagClick(addToBag, product, selectedVariations);
  };

  useEffect(() => {
    // Check if the user has a unique identifier in localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // If no identifier exists, initialize a new user
      initializeUserInFirestore("productDetailsPage");
    } else {
      // If an identifier already exists, update it
      updateUserInFirestore("productDetailsPage");
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <div className="bg-white md:mb-0 md:max-w- md:m-aut px-2 container mx-auto">
        <div className="flex flex-col md:flex-row md:gap-16">
          {/* Desktop */}
          <CarouselDemo product={product} />
          {/* Mobile */}
          <div className="flex sm:hidden overflow-auto gap-2 hide-scrollbar">
            <ProductImageCarousel
              className="w-full md:w-1/2"
              images={product.images ?? []}
              options={{
                loop: true,
              }}
            />
          </div>
          {product.isFreeShipping && (
            <div className="bottom-0 md:hidden flex items-center gap-1 text-xs mb-1 bg-green-50 px-2 py-1 text-green-700 w-full">
              <RiShip2Line className="text-sm" />
              <p className="text-green-700 px-1 md:text-sm">
                {product.isFreeShipping ? `Free shipping` : null}
              </p>
            </div>
          )}
          <div className="md:hidden flex justify-center items-center rounded-b-sm bg-[#f7f7f7] w-full">
            {product.isAvailableInGhana && (
              <div className="px-4 text-center md:text-sm py-4">
                {product.isAvailableInGhana ? (
                  <div>
                    <h2 className="text-sm font-semibold">This item is available in Ghana</h2>
                    <p className="text-xs">Order now for instant delivery</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <div className="w-full">
            <div>
              <h2 className="text-sm font-medium mt-1">{product.name}</h2>
              <div className="flex justify-start items-center gap-2 mt-1">
                <div className="flex text-base text-left items-center gap-2 justify-start">
                  <p className="font-bold text-[#000000]">GHc{product.price}</p>
                </div>

                {product.market_price === 0 ||
                  product.market_price === "0" ||
                  product.market_price === "" ? null : (
                  <div className="flex justify-center items-center gap-2">
                    <span className="line-through text-black/40 text-xs block">
                      GHc{product.market_price}
                    </span>
                    <Popover>
                      <PopoverTrigger>
                        <PiWarningCircle className="text-bas mt- text-black/40" />
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          <p className="text-sm">
                            The price you see with a strikethrough on this
                            platform might be the suggested retail price from the
                            manufacturer, the price suggested by our partners, or
                            the highest price from other stores in the last 90
                            days. Keep in mind, it might not show the current
                            market price of the product.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-4" />
            {product.variations.length !== 0 &&
              renderVariations(
                product,
                selectedVariations,
                handleVariationSelect
              )}
              {product.variations.length !== 0 && <Separator className="my-4" />}
            {product.description !== "" && (
              <>
              <div>
                <strong className="text-sm">Description</strong>
                <p className="text-sm">{product.description}The big brown fox jumps over the lazy dog...</p>
              </div>
              
              <Separator className="my-4" />
              </>
            )}
              <div>
                <strong className="text-sm">Reviews</strong>
                <div className="flex justify-center items-center">
                <p className="text-sm">No reviews - yet</p>
                </div>
              </div>
              <Separator className="my-4" />
            <div className="flex flex-col bg-white justify-center items-center text-white mt-2 fixed md:static bottom-0 right-0 left-0 md:mx-0 z-50 px-2">
              <div className="bg- w-full flex flex-col justify-center items-center py-1">
                {/* Rotating contents with conditional styling */}
                <div
                  style={{
                    display: identity === 1 ? "none" : "block",
                    transition: identity === 1 ? "" : "opacity 1s ease-in-out",
                    opacity: identity === 1 ? 0 : 1,
                  }}
                >
                  {product.isFreeShipping && (
                    <div className="flex items-center text-xs w-max px-2 py-1">
                      <p className="text-[#1d1d1f]">
                        {product.isFreeShipping ? (
                          <>
                            Add this item to{" "}
                            <span className="text-green-600">
                              enjoy free shipping
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: identity === 2 ? "none" : "block",
                    transition: "opacity 0.5s ease-in-out",
                    opacity: identity === 2 ? 0 : 1,
                  }}
                >
                  <div className="flex items-center text-xs w-max px-2 py-1">
                    <p className="text-[#1d1d1f]">
                      <>
                        Hurry.{" "}
                        <span className="text-red-400">
                          Secure your order now!
                        </span>
                      </>
                    </p>
                  </div>
                </div>
                <button
                  className="w-full font-bold bg-green-500 uppercase py-3 rounded-full"
                  onClick={() => {
                    try {
                      // Add product to cart
                      handleAddToBag();

                      // Increment number of enquiries made
                      incrementEnquiryNumber();
                    } catch (error) {
                      console.error("Error incrementing enquiries:", error);
                    }
                  }}
                >
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
