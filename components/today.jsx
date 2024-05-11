"use client";

import Link from "next/link";
import Image from "next/image";
import Explore from "@/components/ui/explore";
import MobileBanner from "@/components/ui/top-banner";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect } from "react";
import {
  initializeUserInFirestore,
  updateUserInFirestore,
} from "@/utils/functions";
import { Separator } from "./ui/separator";

export default function Today({
  allProducts,
  top3CollectionsByViews,
  productsInShoes,
  productsInBagsAndLuggage,
  productsInWatches,
  productsInHomeAndKitchen,
}) {
  useEffect(() => {
    // Check if the user has a unique identifier in localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // If no identifier exists, initialize a new user
      initializeUserInFirestore("shopPage");
    } else {
      // If an identifier already exists, update it
      updateUserInFirestore("shopPage");
      console.log("Returning user with ID:", userId);
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount
  return (
    <div className="md:mt-3 bg-white">


      <div className="pt-2">
        <Explore
          allProducts={allProducts}
          productsInWatches={productsInWatches}
          productsInBagsAndLuggage={productsInBagsAndLuggage}
          productsInHomeAndKitchen={productsInHomeAndKitchen}
          productsInShoes={productsInShoes}
        // productsInWomensSlideSandals={productsInWomensSlideSandals}
        // productsInMensWatches={productsInMensWatches}
        />
      </div>
    </div>
  );
}
