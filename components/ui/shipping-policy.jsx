"use client";
import { RiShip2Line } from "react-icons/ri";
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import { lusitana } from "@/components/ui/fonts";
import { cva } from "class-variance-authority";
const SheetClose = SheetPrimitive.Close;
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetTrigger = SheetPrimitive.Trigger;
import { Separator } from "@/components/ui/separator";

export default function ShippingPolicy() {
  return (
    <div className="text-sm bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="flex justify-start gap-3 md:max-w-[98%] mx-auto p-2">
        <div>
          <RiShip2Line className="text-3xl" />
        </div>
        <div>
          <h1 className="font-semibold">Shipping and delivery</h1>
          {/* <p className="text-[#3e3e41]">Starting Jan 6, 2024</p> */}
          <div className="">
            <Sheet>
              <SheetTrigger>
                <span className="text-[#0066cc]">Learn more</span>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="flex justify-center bg-[#f5f5f7] items-start gap-6 flex-col py- md:max-w-md md:m-auto max-h-[80vh] rounded-t-2xl"
              >
                <div className="overflow-auto rounded-t-2xl">
                  <div className="flex text-3xl items-center gap-4 font-bold justify-center rounded-t-2xl border-b py-4 sticky top-0 bg-white">
                    <h1>Chine</h1>
                    <RiShip2Line className="" />
                    <h1>Ghana</h1>
                  </div>
                  <div className="mt-10">
                    <p className="text-center mx-6">
                      {" "}
                      <span className="text-2xl font-semibold block text-center">
                        We ship most of the items you order straight from
                        manufacturers in China.
                      </span>{" "}
                      <span className="block mb-2">
                        This is why our prices are much lower than what you may
                        see on the market.
                      </span>{" "}
                      And as part of our effort to make shopping much affordable
                      for everyone,{" "}
                      <span className="text-orange-600">
                        we offer free shipping on most of our listed items.
                      </span>
                    </p>
                  </div>
                  {/* <Separator className="text-[#f5f5f7] my-6" /> */}
                  <div className="bg-white my-6 py-4">
                    <div className="bg-orange-50 p-1 mt-4 rounded-lg mx-2">
                      <h1 className="font-semibold text-lg text-orange-600">
                        Shipping
                      </h1>
                      <p className="text-sm pb-3">
                        Goods from China to Ghana take 35 - 55 days to reach our
                        ports and the count starts when the vessel leaves China.{" "}
                        <span className="block pt-2">
                          To be honest, shipping cost for most products is not
                          expensive as you may think.
                        </span>
                        {/*I'd like to indicate an amount someone will pay for a particular product as an example.  */}
                        <span className="block pt-2">
                          The amount you will pay for shipping can only be
                          determined when the items arrive in Ghana. This is so
                          for some reasons but...
                        </span>
                        <span className="block pt-2">
                          We assure you that it is our priority to be able to
                          indicate the shipping cost for individual items on our
                          website for you to make informed decisions on your
                          purchases.
                        </span>
                        <span className="block pt-2">
                          Again, shipping cost is not expensive and you
                          shouldn't let that stop you from purchasing something
                          you desire.
                        </span>
                      </p>
                    </div>
                    <div className="bg-orange-50 p-1 mt-4 rounded-lg mx-2">
                      <h1 className="font-semibold text-lg text-orange-600">
                        Delivery
                      </h1>
                      <p className="text-sm pb-3">
                        We offer delivery service nationwide... so you don't
                        have to worry about how your items will get to your
                        doorstep.{" "}
                        <span className="block pt-2">
                          The amount you will pay for us to deliver your item(s)
                          will depend on the net weight of the item(s) and the
                          location we will deliver to.
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#fff] py-6 px-2">
                    <h2 className="font-bold text-lg">Have questions?</h2>
                    <p className="text-xs">
                      Connect with us on{" "}
                      <a
                        href={`https://wa.me/${233202743233}/?text=${"Hi there,"}%0A%0A`}
                        className="text-blue-400"
                        target="_blank"
                      >
                        WhatsApp
                      </a>{" "}
                      or
                      <a
                        href={`tel:0540610692`}
                        className="text-blue-400"
                        target="_blank"
                      >
                        {" "}
                        call
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 w-full">
                  <SheetClose className="flex sticy focus:outline-none bg-white bottom-4 px-4 justify-center items-center border font-semibold border-gray-300 rounded-3xl w-full py-2">
                    <span>Cancel</span>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
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
