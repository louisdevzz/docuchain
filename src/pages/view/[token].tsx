"use client"

import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { docuchain } from "@/contract/docuchainABI";
import axios from "axios";
import { Worker,Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

const View = () =>{
    const router = useRouter()
    const token = router.query.token;
    const [document, setDocument] = useState<any>([])
    
    const gatewayUrl = "https://olive-rational-giraffe-695.mypinata.cloud"
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    
    useEffect(()=>{
        if(token){
            loadKYC(token as string)
        }
    },[token])

    const loadKYC = async(token: string)=>{
        const decode = await axios.post("/api/decode",{
            "token":token
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })
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
            const data = await contractInstance.getDocumentByHash(decode.data);
            //console.log("data",data)
            if(data){
                const docs = {
                    nameDocs: data[1],
                    ipfsDocs: data[2],
                    creatorName: data[4],
                    agency: data[5],
                    timeCreate: data[6],
                    timeUpdate: data[7],
                    status: data[8]
                }
                setDocument(docs)
            }
        }catch(error){
            console.log("error",error)
        }
    }

    function timeConverter(timestamp: number){
        var a = new Date(timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }
    //console.log(document.timeCreate?.toNumber())
    return(
        <div className="mt-10 flex flex-row w-full gap-10 justify-between items-center">
            <div className="md:px-10 w-full">
                <h1 className="font-semibold text-2xl">Thông tin tài liệu đã xác minh</h1>
                {
                    Object.values(document).length > 0&&(
                        <div className="w-full md:h-[800px] h-full flex flex-col md:flex-row justify-between gap-10 mt-5 pb-32">
                            <div className="flex flex-col md:w-[800px] md:max-h-[200px] w-full h-full gap-3 border p-3 rounded-lg shadow-sm ">
                                <div className="flex flex-row justify-between">
                                    <span>Tên của tài liệu: </span>
                                    <span>{document.nameDocs}</span>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <span>Người đăng tài liệu: </span>
                                    <span>{document.creatorName}</span>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <span>Cơ quan đăng tài liệu: </span>
                                    <span>{document.agency}</span>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <span>Thời gian đăng tài liệu: </span>
                                    <span>{timeConverter(document.timeCreate?.toNumber())}</span>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <span>Thời gian cập nhật tài liệu: </span>
                                    <span>{timeConverter(document.timeUpdate?.toNumber())}</span>
                                </div>
                            </div>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                fileUrl={`${gatewayUrl}/ipfs/${document.ipfsDocs}?pinataGatewayToken=${process.env.TOKEN_PINATA}`}
                                plugins={[defaultLayoutPluginInstance]}
                                />
                            </Worker>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default View;