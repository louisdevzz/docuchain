import { toast } from "react-toastify";
import { ChangeEvent, useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { docuchain } from "@/contract/docuchainABI";
import {
    PaymasterMode,
} from "@biconomy/account";
import { connectWallet } from "@/utils/smartWallet";
import QRCode from 'qrcode';
import { saveAs } from 'file-saver'
import axios from "axios"
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker,Viewer } from "@react-pdf-viewer/core";


export default function Apps(){
    const [file,setFile] = useState<File|undefined>(undefined);
    const [sizeFile,setSizeFile] = useState<string|null>(null);
    const [urlPdf,setUrlPdf] = useState<string|null>(null);
    const [cid,setCid] = useState<string|null>(null);
    const [nameDocument,setNameDocument] = useState<string|null>(null);
    const [agency,setAgency] = useState<string|null>(null);
    const [creatorName,setCreatorName] = useState<string|null>(null);
    const [contentHash, setContentHash] = useState<string|null>(null);
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)

    const gatewayUrl = "https://olive-rational-giraffe-695.mypinata.cloud"
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    
    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
    },[smartAccountAddress])

    //console.log(smartAccountAddress)


    const calculateHash = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const onUploadFile = async(event:ChangeEvent<HTMLInputElement>)=>{
        try{
            const toastId = toast("Upload Pending",{autoClose:false});
            if(event.target.files&&event.target.files[0]){
                const file = event.target.files[0]
                const hash = await calculateHash(file);
                setContentHash(hash)
                setFile(file)
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //console.log(reader.result?.toString())
                    const blob = new Blob([reader.result?.toString() as string],{type: "application/pdf"});
                    const size = blob.size
                    setSizeFile(size.toString())
                };

                const data = new FormData();
                data.set("file", file as File);
                data.append("metadata", JSON.stringify(
                    { 
                        name: file.name
                    }
                ));
                const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.JWT_PINATA_CLOUD}`,
                    },
                    body: data,
                });
                const { IpfsHash } = await res.json();
                setCid(IpfsHash)
                toast.update(toastId, {
                    render: "Upload Information Successfull",
                    type: "success",
                    autoClose: 2000
                });
                // setFile(event.target.files[0])
            }else{
                console.log("Trouble uploading file");
            }
        }catch(err){
            console.log("err",err)
        }
    }
    //console.log(listData)
    const clear = () =>{
        setCid(null)
        setNameDocument('')
        setFile(undefined)
        setCreatorName('')
        setContentHash(null)
    }

    // console.log(process.env.TOKEN_PINATA)

    const onUpload = async()=>{
        try {
            const toastId = toast("Submit Pending",{autoClose:false});
            const contractAddress = "0x31bfde6Ff35DCBe3f71477fAb4a639F4d4F961ef";
            const provider = new ethers.providers.JsonRpcProvider(
                "https://eth-sepolia.public.blastapi.io"
            );

            const contractInstance = new ethers.Contract(
                contractAddress as string,
                docuchain,
                provider
            );
            const timeCreate = Date.now();
            const minTx = await contractInstance.populateTransaction.addDocument(smartAccountAddress,nameDocument,cid,contentHash,creatorName,agency,timeCreate,timeCreate);
            console.log("Mint Tx", minTx.data);
            const tx = {
                to: contractAddress,
                data: minTx.data,
            };

            toast.update(toastId, {
                render: "Sending Transaction",
                autoClose: false,
            });
            const smartAccount = await connectWallet();
            //@ts-ignore
            const userOpResponse = await smartAccount?.sendTransaction(tx, {
                paymasterServiceData: { mode: PaymasterMode.SPONSORED },
            });
            //@ts-ignore
            const { transactionHash } = await userOpResponse.waitForTxHash();
            //console.log("Transaction Hash", transactionHash);
            if (transactionHash) {
                const encode = await axios.post("/api/encode",{
                    "contentHash": contentHash
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
                                name: `${file?.name + " notarized"}`,
                                url: `${gatewayUrl}/ipfs/${cid}?pinataGatewayToken=${process.env.TOKEN_PINATA}`,
                                imagesString: `430;40;0-;${gatewayUrl}/ipfs/${qrCode.IpfsHash}?pinataGatewayToken=${process.env.TOKEN_PINATA};80;80`
                            },{
                            headers:{
                                "Content-Type":"application/json",
                                "x-api-key":"louisdevzz04@gmail.com_HZZRdikD5wLaVX4yWkKTzGNQk9eRBpNsrEbdXF1THCawJ7MVCa6xiy147WJ9GWqc"
                            }
                            })
                            const pdfUrl =  response.data;
                            setUrlPdf(pdfUrl.url)
                            console.log("data",pdfUrl.url)
                        } catch (error) {
                        console.log(error);
                        }
                        
                    })
                    .catch(err => {
                        console.error(err)
                    })
                    clear()
                    toast.update(toastId, {
                        render: "Transaction Successful",
                        type: "success",
                        autoClose: 5000,
                    });
                    console.log("transactionHash",transactionHash);
                }
            }
            const userOpReceipt = await userOpResponse.wait();
            console.log("userOpReceipt",userOpReceipt)
            if (userOpReceipt.success == "true") {
                console.log("UserOp receipt", userOpReceipt);
                console.log("Transaction receipt", userOpReceipt.receipt);
            }
        } catch (e) {
            console.log(e);
            toast("Error!");
        }
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


    return(
        <div className="mt-10 flex flex-row w-full px-6 gap-10 justify-between ">
            <div className="px-10 w-full">
                <h1 className="font-semibold text-2xl">Đăng thông tin văn bản</h1>
                <div className="flex flex-col md:flex-row w-full justify-between ">
                    <div className="flex flex-col gap-2 mt-5">
                        <div className="">
                            <p>Tài liệu văn bản</p>
                            <div className="flex cursor-pointer items-center space-x-6 border border-gray-300 rounded-lg mt-2 w-[400px] focus:border-black">
                                <label className="block cursor-pointer">
                                    <input onChange={onUploadFile} type="file" className="block w-full text-sm text-slate-500 file:cursor-pointer
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
                        
                        <div className="mt-2 flex flex-col gap-2">
                            <label htmlFor="nameStudent">Tên của văn bản</label>
                            <input name="nameStudent" onChange={(e)=>setNameDocument(e.target.value)} type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            <label htmlFor="birthDay">Tên của người chịu trách nhiệm</label>
                            <input name="birthDay" onChange={(e)=>setCreatorName(e.target.value)}  type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                            <label htmlFor="id">Cơ quan</label>
                            <input name="id" onChange={(e)=>setAgency(e.target.value)} type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button onClick={onUpload}  className="md:w-[250px] px-4 py-2 bg-black text-[#fff] rounded-lg hover:bg-opacity-75">
                                <span className="font-semibold">Tải lên</span>
                            </button>
                        </div>
                    </div>
                    {cid &&(
                        <div className="flex flex-col w-[600px] h-[600px] justify-center items-center ">
                            <p className="text-center text-2xl font-semibold mb-10">Xem tài liệu của bạn</p>
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                fileUrl={`https://olive-rational-giraffe-695.mypinata.cloud/ipfs/${cid}?pinataGatewayToken=kV2NKhwJtxSznI_jwNRMQDq3L6xOR75S4TxUcb8WkPtZp6dbCde12sdDshGDX-JU`}
                                plugins={[defaultLayoutPluginInstance]}
                                />
                            </Worker>
                        </div>
                    )}
                    {
                        urlPdf&&(
                            <div className="flex flex-col w-[600px] h-[600px] justify-center items-center ">
                                <p className="text-center text-2xl font-semibold mb-10">Tải tài liệu thành công</p>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    <Viewer
                                    fileUrl={urlPdf}
                                    plugins={[defaultLayoutPluginInstance]}
                                    />
                                </Worker>
                            </div>
                        )
                    }
                </div>
                
            </div>
        </div>
    )
}