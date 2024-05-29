import { Separator } from "@/components/ui/separator";
import CurrentOrders from "@/components/ui/collection/currentOrders";
import TopBanner from "@/components/ui/top-banner";
import Explore from "@/components/ui/explore";
import HomePageCollections from "@/components/ui/homepage-collections"

export default function Page() {
  return (
    <>
      <TopBanner />
      <CurrentOrders />
      <Separator className='py-1 bg-gray-100' />
      <HomePageCollections />
      <Separator className='py-1 bg-gray-100' />
      <Explore/>
    </>
  );
}
