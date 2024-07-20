import { toast } from "react-toastify";
import { useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { ABI } from "@/contract/ABI";
import {
    PaymasterMode,
} from "@biconomy/account";
import { connectWallet } from "@/utils/smartWallet";
import { MintNFT } from "@/utils/SDK";
import QRCode from 'qrcode';


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

    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
    },[smartAccountAddress])

    const uploadFile = (event:any)=>{
        if(event.target.files[0]){
            setFile(event.target.files[0])
            //setImage(URL.createObjectURL(event.target.files[0]))
        }else{
            toast("Trouble uploading file");
        }
    }

    const clear = () =>{
        setCid(null)
        setName('')
        setFile(undefined)
        setBirthDay('')
        setMajor('')
        setGradution('')
        setUniversity('')
    }

    const Sumbit = async()=>{
        if(name&&birthDay&&major&&gradution){
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
                console.log("IpfsHash",IpfsHash)
                // toast.update(toastId, {
                //     render: "Upload Information Successfull",
                //     type: "success",
                // });
                // const transaction = await MintNFT({
                //     smartAccountAddress: smartAccountAddress as string,
                //     ipfs_cid: IpfsHash
                // })
                // toast.update(toastId, {
                //     render: "Mint NFT successfull",
                //     type: "success",
                // });
                const contractAddress = "0xf0873E7C54212f0c94755A103aDb2139a6786314";
                const provider = new ethers.providers.JsonRpcProvider(
                    "https://eth-sepolia.public.blastapi.io"
                );

                const contractInstance = new ethers.Contract(
                    contractAddress as string,
                    ABI,
                    provider
                );
                const minTx = await contractInstance.populateTransaction.registerKYC(idStudent,name,IpfsHash,birthDay,major,gradution,"",university,true);
                console.log("Mint Tx", minTx.data);
                const tx1 = {
                    to: contractAddress,
                    data: minTx.data,
                };
                toast.update(toastId, {
                    render: "Sending Transaction",
                    autoClose: false,
                });
                const smartAccount = await connectWallet();
                //@ts-ignore
                
                const userOpResponse = await smartAccount?.sendTransaction(tx1, {
                    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
                });
                //@ts-ignore
                const { transactionHash } = await userOpResponse.waitForTxHash();
                //console.log("Transaction Hash", transactionHash);
                if (transactionHash) {
                    QRCode.toDataURL(idStudent as string,{ errorCorrectionLevel: 'H' ,width: 800})
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
                
            } catch (e) {
                console.log(e);
                toast("Error!");
            }
            
        }else{
            toast("Please fill out completely before submitting!")
        }
    }


    // const upload = () => {
    //     QRCode.toDataURL(idStudent as string,{ errorCorrectionLevel: 'H' ,width: 800})
    //     .then(url => {
    //         setImage(url)
    //     })
    //     .catch(err => {
    //         console.error(err)
    //     })

    // }
    return(
        <div className="mt-10 flex flex-row w-full px-6 gap-10 justify-between items-center">
            <div className="px-10 w-full">
                <h1 className="font-semibold text-2xl">Upload Certificate</h1>
                <div className="flex flex-col md:flex-row w-full justify-between ">
                    <div className="flex flex-col gap-2 mt-10">
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
                            <button onClick={Sumbit} className="md:w-[250px] px-4 py-2 bg-black text-[#fff] rounded-lg hover:bg-opacity-75">
                                <span className="font-semibold">Upload</span>
                            </button>
                        </div>
                    </div>
                    {image&&(
                        <div className="flex flex-col w-[600px] h-[400px] justify-center items-center mt-20">
                            <p className="text-center text-2xl font-semibold">Your QR Code</p>
                            <div className="border border-gray-300 p-4 mt-10 rounded-md shadow-lg">
                                {image?(
                                    <img width={200} className="w-[400px] justify-center h-[400px] rounded-md" src={image} alt="qr_code" />
                                ):(
                                    <img width={200} className="w-[400px] justify-center h-[400px] rounded-md" src="https://www.qrgpt.io/_next/image?url=https%3A%2F%2Fg4yqcv8qdhf169fk.public.blob.vercel-storage.com%2F6BhfNzx-TmxVWNhp6UBEOT11nZX2cjYZLx6m6E.png&w=640&q=75" alt="qr_code" />
                                )}
                            </div>
                            <div className="flex flex-row gap-10 mt-5">
                                <a href={image as string} download="QR_code" className="px-4 cursor-pointer py-2 bg-black text-[#fff] rounded-md hover:bg-opacity-75">
                                    <span>Download</span>
                                </a>
                                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-opacity-75">
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}