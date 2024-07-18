import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3DCard";
import { ethers } from "ethers";
import { ABI } from "@/contract/ABI";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Footer from "./Footer";


export default function Dashboard(){
    const [allNFTs, setAllNFTs] = useState<any>([]);
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)

    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
        if(smartAccountAddress){
            loadKYC()
        }
    },[smartAccountAddress])

    const loadKYC = async()=>{
        const contractAddress = "0x9d69b7d8A1B9A1Be84c59ef2866820De334E76FD";
        const provider = new ethers.providers.JsonRpcProvider(
            "https://eth-sepolia.public.blastapi.io"
        );
        
        const contractInstance = new ethers.Contract(
            contractAddress as string,
            ABI,
            provider
        );
        try{
            const data = await contractInstance.viewKYC(smartAccountAddress as string);
            if(data){
                const nft = {
                    status: data[0],
                    name: data[1],
                    ipfs_cid: data[2],
                    year: data[3],
                    hash: data[4]
                }
                setAllNFTs(nft)
            }
        }catch(error){
            console.log("error",error)
        }
    }
    
    //console.log("nfts",allNFTs)
    // https://olive-rational-giraffe-695.mypinata.cloud/ipfs/QmdGQ18bdALd3YKuWDFQvztwRzZgoEoEXeVzaJ1EXLNa9F?pinataGatewayToken=kV2NKhwJtxSznI_jwNRMQDq3L6xOR75S4TxUcb8WkPtZp6dbCde12sdDshGDX-JU
    return(
        <div className="flex flex-col">
            <div className="flex flex-col gap-3 px-5 flex-wrap mt-10">
                <div className="mt-2 flex justify-center items-center text-center">
                    <div className="w-3/4">
                        <h1 className="text-5xl text-center leading-[70px] font-semibold tracking-wider">Transparent verification of university diplomas in a seconds</h1>
                        <div className="w-full">
                            <div className="text-center flex justify-center">
                                <p className="font-light mt-5 text-lg text-[#000000b9] w-1/2">BlockCertify simplifies the process of verifying university diplomas using blockchain technology</p>
                            </div>
                        </div>
                        <div className="mt-5 flex flex-row gap-10 justify-center items-center">
                            <Link href={"/app"} className="bg-black text-[#fff] px-5 py-2 rounded-lg shadow-sm hover:bg-opacity-75">
                                <span>Upload Certificate</span>
                            </Link>
                            <Link href={"/verify"} className="border border-gray-300 rounded-lg px-5 py-2 shadow-sm hover:bg-gray-100">
                                <span>Verify Certificate</span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                {
                    allNFTs.length  > 0?(
                        <div className="-mt-10">
                    <CardContainer className="max-w-80">
                            <CardBody className="bg-gray-50 relative group/card  hover:shadow-2xl hover:shadow-emerald-500/[0.1]  border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                                <CardItem
                                translateZ="50"
                                className="text-xl font-bold text-neutral-600"
                                >
                                {allNFTs.name}
                                </CardItem>
                                <CardItem
                                as="p"
                                translateZ="60"
                                className="text-neutral-500 text-sm max-w-sm mt-2s"
                                >
                                {allNFTs.status == true ? "Da xac minh" : "Chua xac minh"}
                                </CardItem>
                                <CardItem translateZ="100" className="w-full mt-4">
                                <img
                                    src={`https://olive-rational-giraffe-695.mypinata.cloud/ipfs/${allNFTs.ipfs_cid}?pinataGatewayToken=kV2NKhwJtxSznI_jwNRMQDq3L6xOR75S4TxUcb8WkPtZp6dbCde12sdDshGDX-JU`}
                                    height="550"
                                    width="550"
                                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                    alt="thumbnail"
                                />
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>
                    ):(
                        <div className="w-full h-[500px]">

                        </div>
                    )
                }
            </div>
            <div className="mt-20 border-t border-gray-200">
                <div className="p-10 flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center ">
                        <h2 className="text-3xl font-semibold tracking-wider">BlockCertify is Proudly Open Source</h2>
                        <p className="mt-1 text-[#000000a6]">Our source code is available on GitHub.</p>
                        <Link href={"https://github.com/louisdevzz/UniCert"} className="mt-8 bg-black text-[#fff] flex flex-row gap-3 px-5 py-2 items-center rounded-lg">
                            <FaGithub />
                            <span>Star on Github</span>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}   