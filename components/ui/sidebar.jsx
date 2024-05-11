import Link from "next/link";
import { BsCollection } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";

export default function Sidebar() {
  return (
    <div className="h-[100vh] bg-[#fafafc] p-2">
      <div className="bg-white rounded-lg shadow-sm ring-1 ring-slate-200/70">
        <Link href={"/shop/collection"} className="p-2 flex justify-between items-center">
          <div className="flex gap-4 items-center w-[80%]">
            <div>
              <BsCollection className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg">Shop All Collections</h3>
              <p className="text-xs text-[#6e6e73]">Explore products curated by editors</p>
            </div>
          </div>
          <div>
            <IoIosArrowForward className="text-2xl" />
          </div>
        </Link>
      </div>
    </div>
  );
}
