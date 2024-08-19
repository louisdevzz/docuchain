import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Footer from "./Footer";
import {docuchain}  from "@/contract/docuchainABI"


export default function Dashboard(){
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
        if(smartAccountAddress){
            checkAdmin()
        }
    },[smartAccountAddress])

    const checkAdmin = async()=>{
        const contractAddress = "0x31bfde6Ff35DCBe3f71477fAb4a639F4d4F961ef";
        const provider = new ethers.providers.JsonRpcProvider(
            "https://eth-sepolia.public.blastapi.io"
        );
        
        const contractInstance = new ethers.Contract(
            contractAddress as string,
            docuchain,
            provider
        );
        try{
            const data = await contractInstance.checkAdmin(smartAccountAddress as string);
            setIsAdmin(data)
        }catch(error){
            console.log("error",error)
        }
    }
    
    //console.log("nfts",allNFTs)
    return(
        <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row-reverse gap-3 px-5 mt-10">
                <div className="w-full flex justify-center">
                    <img width={120} className="w-[300px] h-[300px] md:w-[300px] md:h-[300px] grayscale" src="/assets/blockchain.gif" alt="bg" />
                </div>
                <div className="mt-2 flex justify-center items-start">
                    <div className="">
                        <h1 className="text-2xl md:text-4xl text-center md:text-start md:leading-[47px] font-bold tracking-wider">DocuChain là nền tảng khởi nghiệp sử dụng công nghệ blockchain để xác thực văn bản từ các cơ quan chính quyền</h1>
                        <div className="w-full">
                            <div className="md:text-start text-center flex justify-start">
                                <p className="font-light mt-5 text-sm md:text-lg text-[#000000b9]">DocuChain cung cấp dịch vụ minh bạch, bảo mật và toàn vẹn cho tài liệu</p>
                            </div>
                        </div>
                        <div className="md:mt-10 mt-5 flex flex-col md:flex-row gap-5 md:gap-10 justify-start items-center">
                            {isAdmin&&(
                                <Link href={"/app"} className="bg-black text-[#fff] px-5 py-2 font-semibold rounded-lg shadow-sm hover:bg-opacity-75">
                                <span>Tải tài liệu</span>
                                </Link>
                            )}
                            <Link href={"/verify"} className="border border-gray-300 rounded-lg font-semibold px-5 py-2 shadow-sm hover:bg-gray-100">
                                <span>Xác minh tài liệu</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20 border-t border-gray-200">
                <div className="p-10 flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center ">
                        <h2 className="md:text-3xl text-2xl text-center font-semibold tracking-wider">DocuChain tự hào là mã nguồn mở</h2>
                        <p className="mt-1 text-[#000000a6] text-sm md:text-base">Mã nguồn của chúng tôi có sẵn trên GitHub</p>
                        <Link target="_blank" href={"https://github.com/louisdevzz/docuchain"} className="mt-8 bg-black text-[#fff] flex flex-row gap-3 px-5 py-2 items-center rounded-lg">
                            <FaGithub />
                            <span>Github</span>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}   