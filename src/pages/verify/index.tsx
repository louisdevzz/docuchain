import { useState,useEffect } from "react";
import QrScanner from "qr-scanner"
import { ethers } from "ethers";
import { ABI } from "@/contract/ABI";

const Verify = () =>{
    const [allNFTs, setAllNFTs] = useState<any>([]);
    const [smartAccountAddress,setSmartAccountAddress] = useState<string|null>(null)
    const [image, setImage] = useState<string|null>(null);
    const [result,setResult] = useState<string|null>(null);

    useEffect(()=>{
        setSmartAccountAddress(localStorage.getItem("smartAccountAddress"))
    },[smartAccountAddress])

    const handleUpload = (event:any) =>{
        const img = event.target.files[0];
        if(img){
            console.log(img)
            QrScanner.scanImage(img, { returnDetailedScanResult: true })
            .then(result => setResult(result.data))
            .catch(e => console.log("err",e));
            setImage(URL.createObjectURL(img))
        }
    }

    const verifyKYC = async()=>{
        const contractAddress = "0xf0873E7C54212f0c94755A103aDb2139a6786314";
        const provider = new ethers.providers.JsonRpcProvider(
            "https://eth-sepolia.public.blastapi.io"
        );
        
        const contractInstance = new ethers.Contract(
            contractAddress as string,
            ABI,
            provider
        );
        try{
            const data = await contractInstance.viewKYC(result);
            console.log("data",data)
            if(data){
                const nft = {
                    status: data[0],
                    name: data[1],
                    ipfs_cid: data[2],
                    birthDay: data[3],
                    major: data[4],
                    gradution: data[5],
                    university: data[6]
                }
                setAllNFTs(nft)
            }
        }catch(error){
            console.log("error",error)
        }
    }
    return(
        <div className="mt-10 flex flex-row w-full px-6 gap-10 justify-between items-center">
            <div className="md:px-10 px-2 w-full">
                <h1 className="font-semibold text-2xl">Verify Certificate</h1>
                <div className="flex flex-col gap-20 md:flex-row justify-between md:gap-20">
                    <div className="mt-5">
                        {
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
                        }
                        <div className="mt-5 flex justify-center">
                            <button onClick={verifyKYC} className="md:w-[250px] w-[200px] px-4 py-2 bg-black text-[#fff] rounded-lg hover:bg-opacity-75">
                                <span className="font-semibold">Verify</span>
                            </button>
                        </div>
                    </div>
                    {Object.values(allNFTs).length > 0 &&(
                        <div className="-mt-8 w-full justify-center flex pb-5">
                            <div className="flex justify-center flex-col text-center">
                                <h2 className="text-2xl font-semibold">Information of Certificate</h2>
                                <div className="mt-5 h-full md:max-h-[500px] w-full px-4 py-6 md:w-[600px] border border-gray-300 rounded-lg">
                                    <div className="flex justify-center">
                                        <img width={120} height={60} className="md:w-[400px] w-full h-[250px] mt-3" src={`https://olive-rational-giraffe-695.mypinata.cloud/ipfs/${allNFTs.ipfs_cid}?pinataGatewayToken=kV2NKhwJtxSznI_jwNRMQDq3L6xOR75S4TxUcb8WkPtZp6dbCde12sdDshGDX-JU`} alt="certificate" />
                                    </div>
                                    <div className="border-t-2 border-gray-200 mt-5 w-full"/>
                                    <div className="flex flex-col gap-2 md:gap-3 mt-5 md:mt-0">
                                        <div className="flex flex-col md:flex-row md:mt-2 justify-between gap-2">
                                            <div className="flex flex-row gap-2">
                                                <p>Status: </p>
                                                <div className="flex flex-row gap-1">
                                                    <p>{allNFTs.status?"Verified":"No"}</p>
                                                    <img width={20} src="/assets/verify.svg" alt="verify" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:mt-2 justify-between gap-2 md:gap-0">
                                            <div className="flex flex-row gap-2">
                                                <p>Full Name: </p>
                                                <p>{allNFTs.name}</p>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <p>Birthday: </p>
                                                <p>{allNFTs.birthDay}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:mt-2 justify-between gap-2">
                                            <div className="flex flex-row gap-2">
                                                <p>ID of Student: </p>
                                                <p>{result}</p>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <p>Major: </p>
                                                <p>{allNFTs.major}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:mt-2 justify-between gap-2">
                                            <div className="flex flex-row gap-2">
                                                <p>Gradution year: </p>
                                                <p>{allNFTs.gradution}</p>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <p>University: </p>
                                                <p>{allNFTs.university}</p>
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