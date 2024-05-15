"use client";
import * as React from "react"
import { useStateContext } from "../../context/state-context";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { InfoDialog } from "@/components/ui/info-dialog-with-got-it";
import { RiShip2Line } from "react-icons/ri";
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { MdDelete } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { IoBag } from "react-icons/io5";
import { limitString } from "@/utils/functions";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { lusitana } from "@/components/ui/fonts";
import { cva } from "class-variance-authority";
import { Separator } from "@/components/ui/separator";

const SheetClose = SheetPrimitive.Close;
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetTrigger = SheetPrimitive.Trigger;

import { Dialog, DialogTrigger } from "@/components/ui/dialog";


import { FaWhatsapp } from "react-icons/fa";
import {
  initializeUserInFirestore,
  updateUserInFirestore,
  addOrdersToFirestore,
  addBuyerPersonalInfo,
  placeOrder
} from "@/utils/functions";

// Constants
const WHATSAPP_NUMBER = "233592771234";

const generateOrderMessage = (items) => {
  return items
    .map((item) => {
      const variations =
        item.variations &&
        Object.entries(item.variations)
          .map(([type, value]) => `${type}: ${value}`)
          .join(", ");

      return `${item.name}\nPrice: ${item.price}\nQuantity: ${item.quantity}\n${variations || ""
        }\n\n`;
    })
    .join("");
};

const BagItem = ({ item, onDelete, toggleCartItemQuantity }) => (
  <div className="flex p-2 my-2 gap-4 mx-2 rounded-md">
    {item.images &&
      <div
        className="relative aspect-square min-w-0 h-full flex-[0_0_4rem] md:flex-[0_0_12rem] pl-4"
      >
        <Image
          role="group"
          aria-roledescription="slide"
          src={item.images.src}
          alt={""}
          fill
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute object-cover"
        />
      </div>
      // <div className="relative w-full md:w-[20%] pt-[40%] md:pt-[20%]">

      //   <Image
      //     className="absolute w-full h-full top-0 left-0 object-cover rounded-lg"
      //     src={item.images.src}
      //     width={500}
      //     height={500}
      //     alt=""
      //   />
      //   {item.isFreeShipping && (
      //     <div className="absolute bottom-0 flex items-center gap-1 text-green-50 text-xs bg-green-700 w-full rounded-b-lg px-2">
      //       <RiShip2Line className="text-sm" />
      //       <p className="px-1 md:text-sm">
      //         {item.isFreeShipping ? `Free shipping` : ""}
      //       </p>
      //     </div>
      //   )}
      // </div>
    }
    <div className="w-full">
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between items-center w-full">
          <div>
            <Link href={`/${item.productId}`} className="text-clamp-1" >
              {limitString(item.name, 24)}
            </Link>
            <p className="font-semibold">
              <span className="text-xs">GHc</span>
              {item.price}
            </p>

          </div>
        </div>

        {item.variations && Object.keys(item.variations).length > 0 && (
          <div style={{ display: "flex", flexDirection: "row", gap: "12px" }}>
            {Object.entries(item.variations).map(([type, value]) => (
              <p key={type}>
                <span style={{ fontWeight: "600" }}>{type}:</span> {value}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex md:flex-col items-center md:items-start gap-6 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <span
              className="bg-gray-100 py-1 px-2 rounded-l-lg border-r border-r-gray-300"
              onClick={() => toggleCartItemQuantity(item.id, "dec")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 12H6"
                />
              </svg>
            </span>
            <span className="mx-3">{item.quantity}</span>
            <span
              className="bg-gray-100 py-1 px-2 rounded-r-lg border-l border-l-gray-300"
              onClick={() => toggleCartItemQuantity(item.id, "inc")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="">
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex gap-1 text-red-600 bg-whit borde cursor-pointer border-gray-300 text-sm rounded-lg">
                {/* <MdDelete className="text-lg text-red-" /> */}
                <span >
                  Remove
                </span>

              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[567px] w-[95vw] rounded-md">
              <div className="flex flex-col text-center items-center justify-center mt-4">
                {/* <MdDelete className="text-3xl text-red-600" /> */}
                <h2 className="text-lg">Are you sure you want to remove this item from your bag?</h2>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-white border border-gray-300 text-lg py-1 w-full h-min px-4 rounded-lg"
                >
                  Yes
                </button>
                <button
                  className="bg-white border border-gray-300 text-lg py-1 w-full h-min px-4 rounded-lg"
                >
                  <DialogPrimitive.Close className="w-full">
                    No
                  </DialogPrimitive.Close>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
);

const Bag = () => {
  const [totalPriceInCart, setTotalPriceInCart] = useState(0);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    location: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setBuyerInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const { bagItems, removeItem, toggleCartItemQuantity } = useStateContext();

  const getTotalQuantitiesInCart = () => {
    let q = 0;
    bagItems.map((item) => {
      if (item.hasOwnProperty("quantity")) {
        q += item.quantity;
      }
    });
    return q;
  };

  const totalQuantitiesInCart = getTotalQuantitiesInCart();

  useEffect(() => {
    const getTotalPriceInCart = () => {
      let totalPrice = 0;
      for (const item of bagItems) {
        if (item.hasOwnProperty("price")) {
          totalPrice += item.price * item.quantity;
        }
      }
      setTotalPriceInCart(totalPrice);
    };
    getTotalPriceInCart();
  }, [bagItems]);

  const orderMessage = generateOrderMessage(bagItems);
  const encodedMessage = encodeURIComponent(orderMessage);

  // Check if all necessary fields are filled
  const isInfoComplete =
    buyerInfo.name && buyerInfo.location && buyerInfo.phone; // Add other necessary fields

  // Include buyerInfo in the whatsappUrl only if all info is complete
  const whatsappUrl = isInfoComplete
    ? `https://wa.me/${WHATSAPP_NUMBER}/?text=${encodedMessage}%0A%0A${JSON.stringify(
      buyerInfo
    )}`
    : null;

  const handleDeleteItemClick = (id) => {
    // Call removeItem function from context to remove the item
    removeItem(id);
  };

  useEffect(() => {
    // Check if the user has a unique identifier in localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // If no identifier exists, initialize a new user
      initializeUserInFirestore("cartPage");
    } else {
      // If an identifier already exists, update it
      updateUserInFirestore("cartPage");
      console.log("Returning user with ID:", userId);
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-slate-800 dark:bg-slate-950",
          className
        )}
        {...props}>
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  ))

  return (
    <div className="overflow-hidden">
      <div>
        {bagItems.length === 0 ? (
          <div>
            <div className="flex flex-col justify-center items-center h-[80vh] text-center mx-4">
              <IoBag className="text-6xl mb-4" />
              <h1 className="font-semibold text-xl">No item in your bag</h1>
              <p className="text-sm text-gray-400">Items you add to bag will appear here.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="fixe top-20 md:left-[300px] left-0 right-0 pt-4 z-50 bg-white border-b">
              <div className="flex justify-center items-center flex-col px-2 py-3">
                <h2 className="font-semibold text-xl">
                  Your cart total is <span className="">GHc</span>
                  {totalPriceInCart}
                </h2>
              </div>
              <div className="flex flex-col justify-center text-center mx-4 text-xs">
                <p>
                  ...
                </p>
              </div>
              <div className="max-w-[90%] md:max-w-[35%] mx-auto my-3">
                <div className="md:hidde">
                  <Sheet>
                    <SheetTrigger className="w-full">
                      <span className="bg-green-700 block cursor-pointer text-white text-center py-2 w-full rounded-lg">
                        Continue to order
                      </span>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="flex justify-center items-start gap-6 flex-col p-4 md:max-w-md md:m-auto max-h-[85vh] rounded-t-2xl"
                    >
                      <div className="overflow-auto w-full">
                        <div className="flex flex-col items-center gap-4 mb-14 border-b">
                          <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="name" className="font-semibold">
                              Your name
                            </label>
                            <input
                              className="py-2 px-2 border border-gray-300 focus:border-black focus:border-1 rounded-lg"
                              type="text"
                              id="name"
                              value={buyerInfo.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="location" className="font-semibold">
                              Location
                            </label>
                            <input
                              className="py-2 px-2 border border-gray-300 focus:border-black focus:border-1 rounded-lg"
                              type="text"
                              id="location"
                              value={buyerInfo.location}
                              placeholder={"eg. Accra, East Legon"}
                              onChange={(e) =>
                                handleInputChange("location", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="phone" className="font-semibold">
                              Phone
                            </label>
                            <input
                              className="py-2 px-2 border border-gray-300 focus:border-black focus:border-1 rounded-lg"
                              type="text"
                              id="phone"
                              value={buyerInfo.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                            />
                          </div>
                          {!isInfoComplete && (
                            <p className="text-center text-xs text-red-500 mt-2">
                              Please fill in all the fields to proceed
                            </p>
                          )}
                        </div>
                        <div className="">
                          <Link
                          href={`${whatsappUrl}`}
                            onClick={async (e) => {
                              e.preventDefault();

                              if (!isInfoComplete) {
                                return; // Do not proceed with the click event if isInfoComplete is false
                              }

                              try {
                                // Set loading to true when starting the async operation
                                setLoading(true);

                                // Execute all asynchronous functions simultaneously
                                await Promise.all([
                                  addBuyerPersonalInfo(buyerInfo),
                                  addOrdersToFirestore(bagItems),
                                  placeOrder(buyerInfo, bagItems)
                                ]);
                              } catch (error) {
                                // Handle any errors here, e.g., display an error message
                                console.error("Error:", error);
                              } finally {
                                // Set loading to false when the async operation is complete
                                setLoading(false);
                              }
                              setTimeout(
                                () => (window.location.href = `${whatsappUrl}`),
                                1000
                              );
                            }}
                            disabled={loading || !isInfoComplete}
                            className={`${loading || !isInfoComplete
                                ? "cursor-not-allowed opacity-50 bg-green-200 text-gray-500"
                                : "bg-green-500 text-white"
                              } py-4 flex justify-center items-center w-full gap-3 rounded-lg`}
                          >
                            {loading ? (
                              <span>Loading...</span>
                            ) : (
                              <>
                                <span className="block">
                                  <FaWhatsapp className="text-4xl" />
                                </span>
                                <span className="block text-center">Proceed to WhatsApp</span>
                              </>
                            )}
                          </Link>
                          {/* <Link
                            href={`${whatsappUrl}`}
                            onClick={async (e) => {
                              e.preventDefault();

                              if (!isInfoComplete) {
                                return; // Do not proceed with the click event if isInfoComplete is false
                              }

                              try {
                                // Set loading to true when starting the async operation
                                setLoading(true);

                                // Execute all asynchronous functions simultaneously
                                await Promise.all([
                                  addBuyerPersonalInfo(buyerInfo),
                                  addOrdersToFirestore(bagItems),
                                  placeOrder(buyerInfo, bagItems)
                                ]);

                                // If all functions are successful, proceed to WhatsApp
                                window.open(whatsappUrl, '_blank');
                              } catch (error) {
                                // Handle any errors here, e.g., display an error message
                                console.error("Error:", error);
                              } finally {
                                // Set loading to false when the async operation is complete
                                setLoading(false);
                              }
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${loading || !isInfoComplete
                              ? "cursor-not-allowed opacity-50 bg-green-200 text-gray-500"
                              : "bg-green-500 text-white"
                              } py-4 flex justify-center items-center gap-3 rounded-lg`}
                          >
                            {loading ? (
                              <span>Loading...</span>
                            ) : (
                              <>
                                <span className="block">
                                  <FaWhatsapp className="text-4xl" />
                                </span>
                                <span className="block text-center">
                                  Proceed to WhatsApp
                                </span>
                              </>
                            )}
                          </Link> */}

                          <p className="text-sm text-center pt-2 text-gray-500">
                            We process orders and payments through WhatsApp.
                          </p>
                        </div>
                      </div>

                      <SheetClose className="flex sticky focus:outline-none bg-white bottom-0 justify-center items-center border font-semibold border-gray-300 rounded-3xl w-full py-2">
                        <span>Cancel</span>
                      </SheetClose>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
            <div className="flex flex-col relative top-3 min-h-[80vh]">
              {bagItems.map((item) => (
                <>
                  <BagItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteItemClick}
                    toggleCartItemQuantity={toggleCartItemQuantity}
                  />
                  <Separator className="my-4 w-11/12 mx-auto" />
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bag;
const DialogPortal = DialogPrimitive.Portal
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blu data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80",
      className
    )}
    {...props} />
))

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-slate-800 dark:bg-slate-950",
        className
      )}
      {...props}>
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));

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
        {/* <SheetPrimitive.Close className="absolute right-[0] text-white border-l  p-2 top-0 rounded-se-md ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close> */}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 dark:bg-slate-950",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);
