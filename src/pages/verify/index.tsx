import { useState,useEffect } from "react";
import QrScanner from "qr-scanner"
import { ethers } from "ethers";
import axios from "axios";
import { docuchain } from "@/contract/docuchainABI";
import { Viewer,Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

const Verify = () =>{
    const [document, setDocument] = useState<any>([]);
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)
    const [image, setImage] = useState<string|null>(null);
    const [result,setResult] = useState<string|null>(null);
    const [component, setComponent] = useState<any>(null);
    const [isShow, setIsShow] = useState<boolean>(false);

    const gatewayUrl = "https://olive-rational-giraffe-695.mypinata.cloud"
    const defaultLayoutPluginInstance = defaultLayoutPlugin();


    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
    },[smartAccountAddress])
    console.log(result)
    const handleUpload = (event:any) =>{
        const img = event.target.files[0];
        if(img){
            //console.log(img)
            QrScanner.scanImage(img, { returnDetailedScanResult: true })
            .then(async(result )=>{
                const decode = await axios.post("/api/decode",{
                    "token":result.data
                },{
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                //console.log("decode",decode.data)
                setResult(decode.data)
            })
            .catch(e => console.log("err",e));
            setImage(URL.createObjectURL(img))
        }
    }
    
    const loadKYC = async()=>{
        const contractAddress = "0x32b61E0748a433F07171f48F8f18C8C0Bd1DA382";
        const provider = new ethers.providers.JsonRpcProvider(
            "https://eth-sepolia.public.blastapi.io"
        );
        
        const contractInstance = new ethers.Contract(
            contractAddress as string,
            docuchain,
            provider
        );
        try{
            const data = await contractInstance.viewKYC(result);
            //console.log("data",data)
            if(data){
                const docs = {
                    status: data[0],
                    nameDocs: data[1],
                    ipfsDocs: data[2],
                    creatorName: data[3],
                    agency: data[4],
                    timeCreate: data[5],
                    timeUpdate: data[6]
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

    return(
        
        <div className="mt-10 flex flex-row w-full px-6 gap-10 justify-between items-center">
            <div className="md:px-10 px-2 w-full">
                <h1 className="font-semibold text-2xl">Verify Certificate</h1>
                <div className="flex flex-col gap-20 md:flex-row justify-between md:gap-20">
                    <div className="mt-5">
                        {!isShow&&
                            (
                                image?(
                                    <img width={400} src={image} alt="qr_code" />
                                ):(
                                    <div className="mt-2">
                                        <label htmlFor="qr">QR of Certificate</label>
                                        <div className="flex cursor-pointer items-center space-x-6 border border-gray-300 rounded-lg mt-2 w-full md:w-[400px] focus:border-black">
                                            <label className="block cursor-pointer">
                                                <input onChange={handleUpload} type="file" className="block w-full text-sm text-slate-500 file:cursor-pointer
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:border-0
                                                    file:rounded-l-lg
                                                    file:text-sm file:font-semibold
                                                    file:bg-gray-50 file:text-black
                                                    hover:file:bg-gray-100
                                                "/>
                                            </label>
                                        </div>
                                    </div>
                                )
                            )
                        }
                        <div className="mt-5 flex justify-center">
                            <button onClick={loadKYC} className="md:w-[250px] w-[200px] px-4 py-2 bg-black text-[#fff] rounded-lg hover:bg-opacity-75">
                                <span className="font-semibold">Verify by File</span>
                            </button>
                        </div>

                    </div>
                    {Object.values(document).length > 0 &&(
                        <div className="-mt-8 w-full justify-center flex pb-5">
                            <div className="flex justify-center flex-col text-center">
                                <h2 className="text-2xl font-semibold">Information of Certificate</h2>
                                <div className="mt-5 h-full md:max-h-[500px] w-full px-4 py-6 md:w-[600px] border border-gray-300 rounded-lg">
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                        <Viewer
                                        fileUrl={`${gatewayUrl}/ipfs/${document.ipfsDocs}?pinataGatewayToken=${process.env.TOKEN_PINATA}`}
                                        plugins={[defaultLayoutPluginInstance]}
                                        />
                                    </Worker>
                                    <div className="border-t-2 border-gray-200 mt-5 w-full"/>
                                    <div className="flex flex-col gap-2 md:gap-3 mt-5 md:mt-0">
                                        <div className="flex flex-col mt-10 gap-3 border p-3 rounded-lg shadow-sm ">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Verify;