import { toast } from "react-toastify";
import { useEffect, useState } from "react"
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import { ABI } from "@/contract/ABI";
import {
    PaymasterMode,
} from "@biconomy/account";
import { connectWallet } from "@/utils/smartWallet";


export default function Apps(){
    const [file,setFile] = useState<File|undefined>(undefined);
    const [image,setImage] = useState<string|null>(null);
    const [cid,setCid] = useState<string|null>(null);
    const [name,setName] = useState<string|null>(null);
    const [school,setSchool] = useState<string|null>(null);
    const [year,setYear] = useState<string|null>(null);
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)

    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
    },[smartAccountAddress])

    const uploadFile = (event:any)=>{
        if(event.target.files[0]){
            setFile(event.target.files[0])
            setImage(URL.createObjectURL(event.target.files[0]))
        }else{
            toast("Trouble uploading file");
        }
    }

    const clear = () =>{
        setCid(null)
        setName(null)
        setSchool(null)
        setFile(undefined)
        setYear(null)
    }

    const Sumbit = async()=>{
        if(file&&name&&school&&year){
            try {
                const toastId = toast("Submit Pending",{autoClose:false});
                const data = new FormData();
                data.set("file",file);
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
                const datas = JSON.stringify({
                    pinataContent: {
                        name: name,
                        school: school,
                        year: year,
                        image: "https://gateway.pinata.cloud/ipfs/"+IpfsHash,
                    },
                    pinataMetadata: {
                        name: "metadata.json"
                    }
                })
                const rs = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.JWT_PINATA_CLOUD}`,
                    },
                    body: datas,
                });
                const result = await rs.json();
                console.log("cid",result.IpfsHash)
                toast.update(toastId, {
                    render: "Upload Information Successfull",
                    type: "success",
                    autoClose: 1000,
                });
                const contractAddress = "0x53191dB16a946E5aC8205Dd1a49528730b92b5c0";
                const provider = new ethers.providers.JsonRpcProvider(
                    "https://eth-sepolia.public.blastapi.io"
                );
                
                const contractInstance = new ethers.Contract(
                    contractAddress as string,
                    ABI,
                    provider
                );
                const minTx = await contractInstance.populateTransaction.safeMint(smartAccountAddress,`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
                console.log("Mint Tx Data", minTx.data);
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
                    clear()
                    toast.update(toastId, {
                    render: "Transaction Successful",
                    type: "success",
                    autoClose: 5000,
                    });
                    console.log("transactionHash",transactionHash);
                }
                //setCid(IpfsHash);
                
                // toast.update(toastId, {
                //     render: "Submit Successful",
                //     type: "success",
                //     autoClose: 2000,
                // });
                
            } catch (e) {
                console.log(e);
                toast("Error!");
            }
            
        }else{
            toast("Please fill out completely before submitting!")
        }
    }
    return(
        <div className="mt-10 flex flex-row w-full px-6 gap-10 justify-between items-center">
            <section className="container h-[500px] w-full items-center py-24">
                <div className="bg-white rounded-lg shadow-md overflow-hidden items-center">
                    {image
                    ?<div>
                        <img src={image} width={40} height={80} className="w-full"/>
                    </div>
                    :<div className="px-4 py-6 flex items-center">
                        <div id="image-preview" className="p-6 mb-4 bg-gray-100 flex border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                            <input onChange={uploadFile} id="upload" type="file" className="hidden" accept="image/*" />
                            <label htmlFor="upload" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 text-gray-700 mx-auto mb-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">Upload picture</h5>
                            <p className="font-normal text-sm text-gray-400 md:px-6">Choose photo size should be less than <b className="text-gray-600">2mb</b></p>
                            <p className="font-normal text-sm text-gray-400 md:px-6">and should be in <b className="text-gray-600">JPG, PNG, or GIF</b> format.</p>
                            <span id="filename" className="text-gray-500 bg-gray-200 z-50"></span>
                            </label>
                        </div>
                    </div>
                    }
                </div>
            </section>
            <div className="w-full mt-20 p-6 bg-white border rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Information </h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name:
                </label>
                    <input onChange={(e)=>setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Enter your name"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="school">
                School:
                </label>
                    <input onChange={(e)=>setSchool(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="school" type="text" placeholder="Enter your school"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="year">
                Year:
                </label>
                    <input onChange={(e)=>setYear(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="year"  placeholder="Enter your year"/>
                </div>
                <div className="flex flex-end justify-end">
                    <button onClick={Sumbit} className="w-40 bg-black hover:bg-opacity-75 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}