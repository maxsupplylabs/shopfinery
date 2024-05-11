"use client";
import { incremenHomePageBannersViews } from "@/utils/functions";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function HomePageBanners() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <div className="mx-2 md:mx-0 py-2">
      {/* <Carousel
        plugins={[plugin.current]}
        className="w-full h-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          <CarouselItem> */}
              <div
                href={"/shop/back2schoolsale"}
                onClick={() => incremenHomePageBannersViews()}
                className="md:hidde block focus:outline-none"
              >
                <img
                  className="w-full h-auto md:h-64 lg:h-72 xl:h-96 object-cover"
                  src={"/up-to-70-off-school-essentials.png"}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>
          {/* </CarouselItem> */}
          {/* <CarouselItem>
              <Link
                href={"/shop/dontbreakthebank"}
                onClick={() => incremenHomePageBannersViews()}
                className="md:hidden block my-2 px-2 focus:outline-none min-h-fit"
              >
                <Image
                  className="w-full h-auto"
                  src={"/25orLess.png"}
                  width={500}
                  height={190}
                  alt=""
                />
              </Link>
          </CarouselItem> */}
        {/* </CarouselContent>
      </Carousel> */}
    </div>
  );
}
