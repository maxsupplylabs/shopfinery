"use client";
import React from "react";
import {
  BsFacebook,
  BsInstagram,
  BsPinterest,
  BsReddit,
  BsSnapchat,
  BsTelegram,
  BsTwitter,
  BsWhatsapp,
  BsTiktok,
  BsYoutube,
} from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs"; // Add three dots to the top menu
import {
  Sheet,
  // SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
const SheetPortal = SheetPrimitive.Portal;
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { TfiLocationPin } from "react-icons/tfi";
import { PiLinkSimple } from "react-icons/pi";
import Link from "next/link";
import { PiArrowUpRight } from "react-icons/pi";
import { GoArrowUpRight } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { FaShop } from "react-icons/fa6";

export default function Profile() {
  return (
    <>
      {/* Profile Bio & socials */}
      <div className="flex flex-col justify-start items-start max-h- text-center relative">
        <div>
          {/* Cover Img */}
          <div className="w-full h-44">
            <img
              className="w-full h-full"
              src="/footer.png"
              alt="My profile photo"
            />
          </div>

          {/* Profile Img */}
          <div className="flex flex-col items-start gap-2 px-2 text-left relative bottom-4">
            <div className="w-20 h-20 mb-1 border-4 border-black shadow-xl rounded-[6px]">
              <img
                className="w-full h-full rounded-[6px] object-cover"
                src="/avatar.png"
                alt="My profile photo"
              />
            </div>
            {/* Profiel details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold">Kvinde Imports</h1>
                <span>
                  <FaShop className="text-lg font-bold" />
                </span>
              </div>
              <p className="text-sm mb-2">
                We help you find something great products to buy with curated
                collections from reliable stores around in the country. Offering Faster delivery & Reliable payment.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center text-sm gap-1 text-slate-500">
                  <TfiLocationPin className="text-base" />
                  <span>Earth, Ghana</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#007185] hover:text-[#FF9900]">
                  <PiLinkSimple className="text-base" />
                  <button>Socials</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="ring-2 ring-slate-100/70 shadow rounded-md mx-2 mb-4">
            <Link
              className="flex items-center justify-center font-medium gap-20 hover:underline px-3 py-4"
              href="/shop/today"
            >
              <span>Shop</span>
              <GoArrowUpRight className="text-lg" />
            </Link>
          </div>
        </div>
        <Separator />
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
        <SheetPrimitive.Close className="flex justify-center items-start w-[100%] m-auto mt-4 border border-slate-900 py-2 rounded-full opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800">
          {/* <X className="h-4 w-4" /> */}
          <span>Close</span>
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
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white p-6 shadow-lg rounded-t-2xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 dark:bg-slate-950",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);
