import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { IoIosArrowUp } from "react-icons/io";
import { BsWhatsapp } from "react-icons/bs";
import TextAnimation from "./text-animation";
import Link from "next/link";

export default function TopBanner() {
    const TextArray = [
        "shipping",
        "deals",
        "new arrivals",
    ]
    return (
        <Link href={"https://chat.whatsapp.com/JU78pNZnKgjBvha8u6kiZc"} className="flex flex-col bg-green-100 rounded-t-lg p-2 items-start text-sm mt-4 mx-2 md:mx-0">
            <div className="flex justify-between items-center w-full px-2">
                <div className="flex items-center gap-2">
                    <BsWhatsapp className="text-3xl text-green-500" />
                    <div>
                        <p className="text-green-500 font-medium">Join our WhatsApp group</p>
                        <p className="text-xs text-black/70">
                            Get quick updates on <TextAnimation className="" words={TextArray} />
                        </p>
                    </div>
                </div>
                <div>
                    <LiaExternalLinkAltSolid className="text-xl text-black/70" />
                </div>
            </div>
        </Link>
    )
}