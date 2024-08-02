import { toast } from "react-toastify";
import { useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { ABI } from "@/contract/ABI";
import {
    PaymasterMode,
} from "@biconomy/account";
import { connectWallet } from "@/utils/smartWallet";
import ExcelJS from "exceljs";
import QRCode from 'qrcode';
import { saveAs } from 'file-saver'
import axios from "axios"


export default function Apps(){
    const [file,setFile] = useState<File|undefined>(undefined);
    const [image,setImage] = useState<string|null>(null);
    const [cid,setCid] = useState<string|null>(null);
    const [name,setName] = useState<string|null>(null);
    const [idStudent,setIDStudent] = useState<string|null>(null);
    const [birthDay,setBirthDay] = useState<string|null>(null);
    const [major,setMajor] = useState<string|null>(null);
    const [gradution,setGradution] = useState<string|null>(null);
    const [university,setUniversity] = useState<string|null>(null);
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)
    const [listIMG, setListIMG] = useState<any>([]);
    const [listData, setListData] = useState<any>(null)
    const [select, setSelect] = useState<string|null>(null);
    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
    },[smartAccountAddress])
    const uploadFile = async(event:any)=>{
        if(event.target.files[0]){
            setFile(event.target.files[0])
        }else{
            toast("Trouble uploading file");
        }
    }

    const uploadFileExecel = async(event:any)=>{
        if(event.target.files[0]){
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(event.target.files[0]);

            const worksheet = workbook.worksheets[0];
            const Name = worksheet.getColumn(1).values.slice(-(worksheet.getColumn(1).values.length-2));
            const Birthday = worksheet.getColumn(2).values.slice(-(worksheet.getColumn(1).values.length-2));
            const IDofStudent = worksheet.getColumn(3).values.slice(-(worksheet.getColumn(1).values.length-2));
            const Major = worksheet.getColumn(4).values.slice(-(worksheet.getColumn(1).values.length-2));
            const Gradution = worksheet.getColumn(5).values.slice(-(worksheet.getColumn(1).values.length-2));
            const University = worksheet.getColumn(6).values.slice(-(worksheet.getColumn(1).values.length-2));
            const Image = worksheet.getImages();
            const listData:any = []
            for (let i =0;i<Name.length;i++){
                listData.push({
                    FullName: Name[i],
                    IDofStudent: IDofStudent[i],
                    BirthDay: Birthday[i],
                    Major: Major[i],
                    Gradution: Gradution[i],
                    University: University[i],
                    Certificate: (workbook.model.media.find((m:any) => m.index === Image[i].imageId))?.buffer
                })
            }
            setListData(listData)
        }else{
            toast("Trouble uploading file");
        }
    }
    //console.log(listData)
    const clear = () =>{
        setCid(null)
        setName('')
        setFile(undefined)
        setBirthDay('')
        setMajor('')
        setGradution('')
        setUniversity('')
    }

    const SumbitMultiple = async()=>{
        if(listData.length > 0){
            try {
                const toastId = toast("Submit Pending",{autoClose:false});
                const data = new FormData();
                const listIpfsCid: string[] = [];
                for(let i =0; i< listData.length;i++){
                    const blob = new Blob([listData[i].Certificate]);
                    const file = new File([blob], "file")
                    data.set("file", file as File);
                    data.append("metadata", JSON.stringify(
                        { 
                            name: name
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
                    listIpfsCid.push(IpfsHash);
                }
                console.log(listIpfsCid)
                toast.update(toastId, {
                    render: "Upload Information Successfull",
                    type: "success",
                });
                
                const contractAddress = "0x32b61E0748a433F07171f48F8f18C8C0Bd1DA382";
                const provider = new ethers.providers.JsonRpcProvider(
                    "https://eth-sepolia.public.blastapi.io"
                );

                const contractInstance = new ethers.Contract(
                    contractAddress as string,
                    ABI,
                    provider
                );
                const listTransaction:any = [];
                for(let i=0;i<listData.length;i++){
                    //console.log("listData[i].IDofStudent",listData[i].IDofStudent)
                    const minTx = await contractInstance.populateTransaction.registerKYC(smartAccountAddress,Number(listData[i].IDofStudent).toString(),listData[i].FullName,listIpfsCid[i],new Date(listData[i].BirthDay).toLocaleDateString("es"),listData[i].Major,Number(listData[i].Gradution).toString(),"",listData[i].University,true);
                    console.log("Mint Tx", minTx.data);
                    const tx = {
                        to: contractAddress,
                        data: minTx.data,
                    };
                    listTransaction.push(tx)
                }
                
                console.log(listTransaction)

                toast.update(toastId, {
                    render: "Sending Transaction",
                    autoClose: false,
                });
                const smartAccount = await connectWallet();
                //@ts-ignore
                const userOpResponse = await smartAccount?.sendTransaction(listTransaction, {
                    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
                });
                //@ts-ignore
                const { transactionHash } = await userOpResponse.waitForTxHash();
                //console.log("Transaction Hash", transactionHash);
                if (transactionHash) {
                    const listUrl: string[] = [];
                for(let i=0; i<listData.length;i++){
                    //console.log("listData[i].IDofStudent",listData[i].IDofStudent)
                    const encode = await axios.post("/api/encode",{
                        "idofStudent":`${listData[i].IDofStudent}`
                    },{
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                    QRCode.toDataURL(encode.data,{ errorCorrectionLevel: 'H' ,width: 800})
                        .then(url => {
                            listUrl.push(url)
                        })
                    }
                    setListIMG(listUrl)
                    // .catch(err => {
                    //     console.error(err)
                    // })
                    clear()
                    toast.update(toastId, {
                    render: "Transaction Successful",
                    type: "success",
                    autoClose: 5000,
                    });
                    console.log("transactionHash",transactionHash);
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
            
        }else{
            toast("Please fill out completely before submitting!")
        }
    }

    const SumbitSingle = async()=>{
        try {
            const toastId = toast("Submit Pending",{autoClose:false});
            const data = new FormData();
            data.set("file", file as File);
            data.append("metadata", JSON.stringify(
                { 
                    name: name
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
            toast.update(toastId, {
                render: "Upload Information Successfull",
                type: "success",
            });
            
            const contractAddress = "0x32b61E0748a433F07171f48F8f18C8C0Bd1DA382";
            const provider = new ethers.providers.JsonRpcProvider(
                "https://eth-sepolia.public.blastapi.io"
            );

            const contractInstance = new ethers.Contract(
                contractAddress as string,
                ABI,
                provider
            );
            const minTx = await contractInstance.populateTransaction.registerKYC(smartAccountAddress,idStudent,name,IpfsHash,birthDay,major,gradution,"",university,true);
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
                    "idofStudent":`${idStudent}`
                },{
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                QRCode.toDataURL(encode.data,{ errorCorrectionLevel: 'H' ,width: 800})
                .then(url => {
                    setImage(url)
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

    const downloadAllQR = () =>{
        for(let i =0;i<listIMG.length;i++){
            saveAs(listIMG[i], `image_${listData[i].FullName}.jpg`)
        }
    }
    
    console.log(image)
    return(
        <div className="mt-10 flex flex-row w-full px-6 gap-10 justify-between ">
            <div className="px-10 w-full">
                <h1 className="font-semibold text-2xl">Upload Certificate</h1>
                <select onChange={(e)=>setSelect(e.target.value)} className="mt-10 px-3 py-2 bg-slate-200 cursor-pointer rounded-lg">
                    <option selected disabled>-- Please Choose Method Upload --</option>
                    <option value="single">Single</option>
                    <option value="multiple">Multiple</option>
                </select>
                {
                    select=="single"?(
                        <div className="flex flex-col md:flex-row w-full justify-between ">
                            <div className="flex flex-col gap-2 mt-5">
                                <div className="">
                                    <p>Image for certificate</p>
                                    <div className="flex cursor-pointer items-center space-x-6 border border-gray-300 rounded-lg mt-2 w-[400px] focus:border-black">
                                        <label className="block cursor-pointer">
                                            <input onChange={uploadFile} type="file" className="block w-full text-sm text-slate-500 file:cursor-pointer
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
                                    <label htmlFor="nameStudent">Full Name student</label>
                                    <input name="nameStudent" onChange={(e)=>setName(e.target.value)} type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                                </div>
                                <div className="mt-2 flex flex-col gap-2">
                                    <label htmlFor="birthDay">Birthday student</label>
                                    <input name="birthDay" onChange={(e)=>setBirthDay(e.target.value)}  type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                                </div>
                                <div className="mt-2 flex flex-col gap-2">
                                    <label htmlFor="id">ID of student</label>
                                    <input name="id" onChange={(e)=>setIDStudent(e.target.value)} type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                                </div>
                                <div className="mt-2 flex flex-col gap-2">
                                    <label htmlFor="major">Major of student</label>
                                    <input name="major" onChange={(e)=>setMajor(e.target.value)}  type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                                </div>
                                <div className="mt-2 flex flex-col gap-2">
                                    <label htmlFor="gradution">Gradution year</label>
                                    <input name="gradution" onChange={(e)=>setGradution(e.target.value)}  type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                                </div>
                                <div className="mt-2 flex flex-col gap-2">
                                    <label htmlFor="university">University year</label>
                                    <input name="university" onChange={(e)=>setUniversity(e.target.value)}  type="text"  className="border border-gray-300 px-3 py-2 rounded-lg"/>
                                </div>
                                <div className="mt-2 flex justify-center">
                                    <button onClick={SumbitSingle} className="md:w-[250px] px-4 py-2 bg-black text-[#fff] rounded-lg hover:bg-opacity-75">
                                        <span className="font-semibold">Upload</span>
                                    </button>
                                </div>
                            </div>
                            {image &&(
                                <div className="flex flex-col w-[600px] h-[400px] justify-center items-center -mt-10">
                                    <p className="text-center text-2xl font-semibold">Your QR Code</p>
                                    <div className="flex flex-row gap-5 mt-10 w-full justify-center items-center">
                                        <div className="border border-gray-300 p-4  rounded-md shadow-lg">
                                            <img width={200} className="w-[200px] justify-center h-[200px] rounded-md" src={image} alt="qr_code" />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-10 mt-5">
                                        <a href={image as string} download={`QR_${name}`} className="px-4 cursor-pointer py-2 bg-black text-[#fff] rounded-md hover:bg-opacity-75">
                                            <span>Download</span>
                                        </a>
                                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-opacity-75">
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ):select=="multiple"&&(
                        <div className="flex flex-col md:flex-row justify-between w-full">
                            <div className="flex flex-col">
                                <div className="mt-5">
                                    <p>File data for Student</p>
                                    <div className="flex cursor-pointer items-center space-x-6 border border-gray-300 rounded-lg mt-2 w-full md:w-[400px] focus:border-black">
                                        <label className="block cursor-pointer">
                                            <input onChange={uploadFileExecel} type="file" className="block w-full text-sm text-slate-500 file:cursor-pointer
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
                                <div className="mt-5 flex justify-start">
                                    <button onClick={SumbitMultiple} className="md:w-[250px] px-4 py-2 bg-black text-[#fff] rounded-lg hover:bg-opacity-75">
                                        <span className="font-semibold">Upload</span>
                                    </button>
                                </div>
                            </div>
                            {listIMG.length > 0 &&(
                                <div className="flex flex-col w-[600px] h-[400px] justify-center items-center md:-mt-[15vh]">
                                    <p className="text-center text-2xl font-semibold">Your QR Code</p>
                                    <div className="flex flex-col md:flex-row gap-5 mt-10 w-full justify-center items-center">
                                        {
                                            listIMG.map((url:string,idx:number)=>(
                                            <div key={idx} className="border border-gray-300 p-4  rounded-md shadow-lg">
                                                <img width={200} className="w-[200px] justify-center h-[200px] rounded-md" src={url} alt="qr_code" />
                                            </div>
                                                ))
                                            
                                        }
                                    </div>
                                    <div className="flex flex-row gap-10 mt-5">
                                        <button onClick={downloadAllQR} className="px-4 cursor-pointer py-2 bg-black text-[#fff] rounded-md hover:bg-opacity-75">
                                            <span>Download</span>
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-opacity-75">
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    )
}