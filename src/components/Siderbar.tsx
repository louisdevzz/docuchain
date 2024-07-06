import Link from "next/link"
import { FaHome } from "react-icons/fa";
import { IoIosApps } from "react-icons/io";


export default function Siderbar(){
    return(
        <div className="flex flex-col mt-10 gap-3">
            <Link href={"/"} className="bg-gray-200 flex flex-row items-center gap-5 bg-opacity-30 h-12 px-5 py-2">
                <FaHome size={20}/>
                <span className="font-medium">Home</span>
            </Link>
            <Link href={"/app"} className="flex flex-row items-center gap-5 bg-opacity-30 h-12 px-5 py-2">
                <IoIosApps size={20} />
                <span>Apps</span>
            </Link>
        </div>
    )
}