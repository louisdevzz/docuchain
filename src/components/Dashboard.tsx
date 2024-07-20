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
        <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row-reverse gap-3 px-5 mt-10">
                <div className="w-full flex justify-center">
                    <img width={120} className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] grayscale" src="/assets/KYC.gif" alt="" />
                </div>
                <div className="mt-2 flex justify-center items-start">
                    <div className="">
                        <h1 className="text-2xl md:text-5xl text-center md:text-start md:leading-[62px] font-semibold tracking-wider">Transparent verification of university diplomas in a seconds</h1>
                        <div className="w-full">
                            <div className="md:text-start text-center flex justify-start">
                                <p className="font-light mt-5 text-sm md:text-lg text-[#000000b9]">BlockCertify simplifies the process of verifying university diplomas using blockchain technology</p>
                            </div>
                        </div>
                        <div className="md:mt-10 mt-5 flex flex-col md:flex-row gap-5 md:gap-10 justify-start items-center">
                            <Link href={"/app"} className="bg-black text-[#fff] px-5 py-2 rounded-lg shadow-sm hover:bg-opacity-75">
                                <span>Upload Certificate</span>
                            </Link>
                            <Link href={"/verify"} className="border border-gray-300 rounded-lg px-5 py-2 shadow-sm hover:bg-gray-100">
                                <span>Verify Certificate</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20 border-t border-gray-200">
                <div className="p-10 flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center ">
                        <h2 className="md:text-3xl text-2xl text-center font-semibold tracking-wider">BlockCertify is Proudly Open Source</h2>
                        <p className="mt-1 text-[#000000a6] text-sm md:text-base">Our source code is available on GitHub.</p>
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