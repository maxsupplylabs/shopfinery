import { Separator } from "@/components/ui/separator";
import HomePageBanners from "@/components/ui/collection/homePageBanners";
import HomePageCollections from "@/components/ui/homepage-collections";
import Explore from "@/components/ui/explore";
import TopBanner from "@/components/ui/top-banner";
export default async function Page() {
  return (
    <>
      <TopBanner />
      <HomePageBanners />
      <Separator className='py-1 bg-gray-100'/>
      <HomePageCollections />
      <Separator className="py-1 bg-gray-100" />
        <Explore
        />
    </>
  );
}
