import { useState,useEffect, ChangeEvent } from "react";
import { ethers } from "ethers";
import { docuchain } from "@/contract/docuchainABI";
import { Viewer,Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import axios from "axios";
import QRCode from 'qrcode';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Verify = () =>{
    const [document, setDocument] = useState<any>([]);
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)
    const [contentHash,setContentHash] = useState<string|null>(null);
    const [file, setFile] = useState<File|null>(null)
    const [urlPdf, setUrlPdf] = useState<string|null>(null)
    const [isVerify, setIsVerify] = useState<boolean>(false)

    const gatewayUrl = "https://olive-rational-giraffe-695.mypinata.cloud"
    const defaultLayoutPluginInstance = defaultLayoutPlugin();


    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
    },[smartAccountAddress])
    //console.log(result)
    
    const calculateHash = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const handleUpload = async(event:ChangeEvent<HTMLInputElement>) =>{
        const file = event.target.files&&event.target.files[0];
        setFile(file as File)
        const hash = await calculateHash(file as File);
        setContentHash(hash)
    }

    function DataURIToBlob(dataURI: string) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
    }
    
    const verifyDocument = async()=>{
        
        const toastId = toast("Vui lòng chờ xác minh",{autoClose:false});
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
            const data = await contractInstance.getDocumentByHash(contentHash);
            console.log("data",data)
            setIsVerify(true)
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
                if(docs.ipfsDocs!=""){
                    const encode = await axios.post("/api/encode",{
                        "contentHash": data[3]
                    },{
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                    if(encode.data){
                        QRCode.toDataURL(`${process.env.WEB_PATH}/view/${encode.data}`,{ errorCorrectionLevel: 'H' ,width: 800})
                        .then(async(url) => {
                            //console.log("qrcode",url)
                            try {
                                const filePdf = DataURIToBlob(url)
                                const data = new FormData();
                                data.append("file", filePdf);
                                
                                const upload = await fetch(
                                    "https://api.pinata.cloud/pinning/pinFileToIPFS",
                                    {
                                        method: "POST",
                                        headers: {
                                        Authorization: `Bearer ${process.env.JWT_PINATA_CLOUD}`,
                                        },
                                        body: data,
                                    },
                                );
                                const qrCode = await upload.json();
                                console.log("qrCode",qrCode.IpfsHash);
                                const response = await axios.post("https://api.pdf.co/v1/pdf/edit/add",{
                                    async: false,
                                    inline: true,
                                    name: `${file?.name.replace(".pdf","-") + " đã xác minh"}`,
                                    url: `${gatewayUrl}/ipfs/${docs.ipfsDocs}?pinataGatewayToken=${process.env.TOKEN_PINATA}`,
                                    imagesString: `430;40;0-;${gatewayUrl}/ipfs/${qrCode.IpfsHash}?pinataGatewayToken=${process.env.TOKEN_PINATA};80;80`
                                },{
                                headers:{
                                    "Content-Type":"application/json",
                                    "x-api-key":"louisdevzz04@gmail.com_HZZRdikD5wLaVX4yWkKTzGNQk9eRBpNsrEbdXF1THCawJ7MVCa6xiy147WJ9GWqc"
                                }
                                })
                                const pdfUrl =  response.data;
                                setUrlPdf(pdfUrl.url)
                                toast.update(toastId, {
                                    render: "Xác minh thành công",
                                    type: "success",
                                    autoClose: 5000,
                                });
                                console.log("data",pdfUrl.url)
                            } catch (error) {
                            console.log(error);
                            }
                            
                        })
                        .catch(err => {
                            toast.update(toastId, {
                                render: "Xác minh không thành công",
                                type: "error",
                                autoClose: 5000,
                            });
                            console.error(err)
                        })
                        
                    }
                }else{
                    toast.update(toastId, {
                        render: "Xác minh không thành công",
                        type: "error",
                        autoClose: 5000,
                    });
                }
            }
        }catch(error){
            toast.update(toastId, {
                render: "Xác minh không thành công",
                type: "error",
                autoClose: 5000,
            });
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
                <h1 className="font-semibold text-2xl">Xác minh tài liệu</h1>
                <div className="flex flex-col gap-20 md:flex-row justify-between md:gap-20">
                    <div className="mt-5">
                        <div className="mt-2">
                            <label htmlFor="qr">Tài liệu cần xác minh</label>
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
                        <div className="mt-5 flex justify-center">
                            <button onClick={verifyDocument} className="md:w-[250px] w-[200px] px-4 py-2 bg-black text-[#fff] rounded-lg hover:bg-opacity-75">
                                <span className="font-semibold">Xác minh tài liệu</span>
                            </button>
                        </div>
                    </div>
                    
                </div>
                <div className="flex flex-col md:flex-row justify-between mt-20 gap-10">
                    {Object.values(document).length > 0 && document?.ipfsDocs != "" ?(
                            <div className="-mt-8 w-full justify-center flex pb-5">
                                <div className="flex justify-center flex-col text-center">
                                    <h2 className="text-2xl font-semibold">Tài liệu gốc</h2>
                                    <div className="mt-5 h-full md:max-h-[500px] w-full md:w-[600px]">
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
                        ):(
                            isVerify&&(
                                <span className="font-semibold">Không có tài liệu này trên cơ sở dữ liệu</span>
                            )
                        )}
                        {urlPdf &&(
                            <div className="-mt-8 w-full justify-center flex pb-5">
                                <div className="flex justify-center flex-col text-center">
                                    <h2 className="text-2xl font-semibold">Tài liệu đã xác minh</h2>
                                    <div className="mt-5 h-full md:max-h-[500px] w-full md:w-[600px]">
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                            <Viewer
                                            fileUrl={urlPdf}
                                            plugins={[defaultLayoutPluginInstance]}
                                            />
                                        </Worker>
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