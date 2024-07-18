import Header from "@/components/Header"
import Siderbar from "./Siderbar";


export default function Layout({children}:{children: any}){
    return(
        <div>
            <Header/>
            <div className="container mx-auto flex flex-row max-w-screen-xl">
                <div className="w-full min-h-screen">
                    {children}
                </div>
            </div>
        </div>
    )
}